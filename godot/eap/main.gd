extends Node2D

# EAP — Evaporate All Parasites (Godot 4 version)
# The whole game in one script: attach it to a Node2D and press Play. No other files needed.
#
# Story:
#   1. THE FOREST: GRAVE (EAP Corporation) evaporates DESTRUCTION MAKER, then gets in the van.
#   2. THE RESTING OF THE UNSTABLE: evaporate 100 UNSTABLE, then get back in the van.
#   3. THE KEYS KEEPER: locked in the van. Hide from his footsteps, find 3 keys, unlock the back door.
# Every time Grave gets in the van it's a checkpoint: health and battery refill.
#
# Controls:
#   A / D or arrows ........ move
#   W / Space / Up ......... jump
#   Right-click (or left-click, or F) ... shoot, hold to charge
#   E ...................... hide in drawer / open door / pick up key (inside the van)
#   S / Down ............... climb out / close door (inside the van)
#   R ...................... try again after dying
#   M ...................... sound on / off

# Change to 2 or 3 to start at a later part of the story (handy for testing)
const START_LEVEL := 1

const VIEW_W := 960.0
const VIEW_H := 540.0
const WORLD_W := 2880.0
const FLOOR_Y := 450.0
const GRAVITY := 2200.0

# Grave
const MOVE_SPEED := 260.0
const JUMP_SPEED := 630.0 # about one Grave-height
const GRAVE_MAX_HP := 100.0
const HIT_INVULN := 0.8 # seconds of safety after being hit

# Evaporator
const BEAM_SPEED := 950.0
const TAP_THRESHOLD := 0.15 # holding shorter than this is a quick shot
const MAX_CHARGE := 1.2 # seconds to full charge
const BATTERY_MAX := 100.0
const BATTERY_DRAIN := 35.0 # per second while charging (never refills, except at the van)
const BEAM_MIN_DAMAGE := 8
const BEAM_MAX_DAMAGE := 40

# Destruction Maker
const GOBLIN_MAX_HP := 150.0
const GOBLIN_SCALE := 1.8
const GOBLIN_WAKE_RANGE := 750.0
const GOBLIN_SPEED := 120.0
const GOBLIN_KEEP_DISTANCE := 320.0
const LAVA_GRAVITY := 900.0
const LAVA_FLIGHT_TIME := 1.0
const LAVA_DAMAGE := 20.0
const LAVA_RADIUS := 18.0

# Van
const VAN_X := 2640.0 # where it waits in the forest
const VAN_W := 200.0
const VAN_PARK_X := 40.0 # where it parks after arriving somewhere new

# THE UNSTABLE
const UNSTABLE_MAX_HP := 16.0
const UNSTABLE_DAMAGE := 5.0
const UNSTABLE_SPEED := 90.0
const UNSTABLE_EMERGE_TIME := 0.9
const UNSTABLE_TOTAL := 100
const UNSTABLE_MAX_ALIVE := 6
const UNSTABLE_SPAWN_INTERVAL := 1.1

# Story timing
const DRIVE_TIME := 2.0
const TITLE_TIME := 3.2
const ARRIVE_TIME := 1.5

# Inside the van
const DRAWERS := [250.0, 375.0, 705.0] # centre x of each drawer
const DRAWER_W := 110.0
const BACK_DOOR_X := 470.0
const BACK_DOOR_W := 120.0
const LEFT_DOOR_X := 40.0
const RIGHT_DOOR_X := 810.0
const SIDE_DOOR_W := 110.0
const RED_CHANCE := 0.35
const STEP_INTERVAL := 0.55

const ACCENT := Color("#35e0a1")
const BEAM_COLOR := Color("#ffe24a")
const LAVA_COLOR := Color("#ff6a1a")
const HP_COLOR := Color("#e74c3c")
const BATTERY_COLOR := Color("#4ab8ff")
const UNSTABLE_COLOR := Color("#b45cff")
const KEEPER_EYES := Color("#ffc94a")
const KEY_COLORS := {"blue": Color("#3d8bff"), "green": Color("#35e05a"), "red": Color("#ff3030")}
const LEVEL_NAMES := {1: "THE FOREST", 2: "THE RESTING OF THE UNSTABLE", 3: "THE KEYS KEEPER"}


class Hero:
	var name := "GRAVE"
	var x := 200.0
	var y := 450.0 # feet position
	var vy := 0.0
	var w := 36.0
	var h := 84.0
	var facing := 1
	var on_ground := true
	var walk_time := 0.0
	var hp := 100.0
	var invuln := 0.0
	var battery := 100.0
	var charging := false
	var charge_time := 0.0 # how long the fire button has been held
	var charge := 0.0 # stored charge in seconds


class Beam:
	var pos := Vector2.ZERO
	var vel := Vector2.ZERO
	var damage := 0
	var size := 4.0
	var life := 1.5


class Goblin:
	var name := "DESTRUCTION MAKER"
	var x := 1500.0
	var y := 450.0
	var vy := 0.0
	var w := 50.0 # 28 * GOBLIN_SCALE
	var h := 72.0 # 40 * GOBLIN_SCALE
	var facing := -1
	var hp := 150.0
	var awake := false
	var alive := true
	var throw_cooldown := 1.2
	var throw_anim := 0.0 # > 0 while the throwing arm is raised
	var hop_cooldown := 1.5
	var hurt_flash := 0.0
	var walk_time := 0.0


class LavaBall:
	var pos := Vector2.ZERO
	var vel := Vector2.ZERO
	var dead := false


class Unstable:
	var x := 0.0
	var y := 450.0
	var vy := 0.0
	var w := 40.0
	var h := 40.0
	var hp := 16.0
	var emerging := true
	var t := 0.0
	var hop_cooldown := 1.0
	var hurt_flash := 0.0
	var seed_offset := 0.0


class Particle:
	var pos := Vector2.ZERO
	var vel := Vector2.ZERO
	var life := 0.5
	var max_life := 0.5
	var size := 3.0
	var color := Color.WHITE


class FloatText:
	var pos := Vector2.ZERO
	var text := ""
	var life := 0.8
	var color := Color.WHITE


class Thud:
	var side := "left"
	var life := 0.6
	var volume := 1.0


# ---------- game state ----------

var level := 1
var status := "playing" # playing, driving, title, arriving, won, lost
var phase_time := 0.0
var checkpoint := 1 # where Grave restarts after dying
var next_level := 1 # level the title card leads into
var death_reason := ""

var grave := Hero.new()
var goblin := Goblin.new()
var beams: Array = []
var lava: Array = []
var unstables: Array = []
var particles: Array = []
var texts: Array = []
var unstable_spawned := 0
var unstable_evaporated := 0
var spawn_timer := 1.5
var cam_x := 0.0
var hint := ""
var hint_time := 0.0

# Input
var aim := Vector2.ZERO # mouse position in the world
var jump_pressed := false
var action_pressed := false
var down_pressed := false

# Inside the van
var hiding_in := -1
var door_open := "" # "left", "right" or ""
var door_key := "" # key lying outside the open door: "blue", "green", "red" or ""
var outside_keys: Array = []
var inside_key := ""
var inside_key_drawer := 0
var searched: Array = [false, false, false]
var keeper_phase := "quiet" # quiet, approach, near, leaving
var keeper_t := 0.0
var keeper_duration := 5.0
var keeper_step_timer := 0.0
var keeper_side := "left"
var thuds: Array = []
var message := ""
var message_time := 0.0
var unlock_time := 0.0


func _ready() -> void:
	randomize()
	build_sounds()
	if START_LEVEL == 1:
		new_game()
	else:
		arrive_at(START_LEVEL)


func reset_level(lvl: int, cp: int) -> void:
	level = lvl
	checkpoint = cp
	next_level = lvl
	status = "playing"
	phase_time = 0.0
	death_reason = ""
	grave = Hero.new() # full health and battery
	goblin = Goblin.new()
	beams.clear()
	lava.clear()
	unstables.clear()
	particles.clear()
	texts.clear()
	unstable_spawned = 0
	unstable_evaporated = 0
	spawn_timer = 1.5
	cam_x = 0.0
	hint_time = 0.0
	reset_van_room()


func new_game() -> void:
	reset_level(1, 1)


# Start a level straight from the van (after a title card, or when retrying a checkpoint)
func arrive_at(lvl: int) -> void:
	reset_level(lvl, lvl)
	if lvl == 3:
		grave.x = 448.0 # locked inside the van, beside the back door
	else:
		status = "arriving"
		grave.x = VAN_PARK_X + VAN_W + 40.0


func restart() -> void:
	if status == "lost" and checkpoint != 1:
		arrive_at(checkpoint)
	else:
		new_game()


# Got in the van: checkpoint (refill), then a title card for the next place
func board_van(next: int, new_status: String) -> void:
	status = new_status
	phase_time = 0.0
	next_level = next
	checkpoint = next
	grave.hp = GRAVE_MAX_HP
	grave.battery = BATTERY_MAX
	lava.clear()
	beams.clear()


func show_hint(text_to_show: String) -> void:
	hint = text_to_show
	hint_time = 0.5


func is_over() -> bool:
	return status == "won" or status == "lost"


# ---------- input ----------

func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		match event.keycode:
			KEY_W, KEY_UP, KEY_SPACE:
				jump_pressed = true
			KEY_E:
				action_pressed = true
			KEY_S, KEY_DOWN:
				down_pressed = true
			KEY_R:
				if is_over():
					restart()
			KEY_M:
				AudioServer.set_bus_mute(0, not AudioServer.is_bus_mute(0))
	if event is InputEventMouseButton and event.pressed and is_over():
		restart()


func key(a: Key, b: Key) -> bool:
	return Input.is_key_pressed(a) or Input.is_key_pressed(b)


func fire_held() -> bool:
	return Input.is_mouse_button_pressed(MOUSE_BUTTON_RIGHT) \
		or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT) \
		or Input.is_key_pressed(KEY_F)


# ---------- main loop ----------

func _process(delta: float) -> void:
	delta = minf(delta, 1.0 / 30.0)
	phase_time += delta
	aim = get_local_mouse_position() + Vector2(cam_x, 0)
	hint_time = maxf(0.0, hint_time - delta)

	# Spooky background sound for the current place; dread rises as the Keys Keeper gets close
	var mood_level := next_level if status == "title" else level
	var dread := footstep_volume() if (level == 3 and status == "playing") else 0.0
	update_audio(mood_level, dread, delta)

	if status == "driving" and phase_time > DRIVE_TIME:
		status = "title"
		phase_time = 0.0
	elif status == "title" and phase_time > TITLE_TIME:
		arrive_at(next_level)
	elif status == "arriving" and phase_time > ARRIVE_TIME:
		status = "playing"
		phase_time = 0.0

	if status == "playing":
		if level == 3:
			update_van_room(delta)
		else:
			update_grave(delta)
			for b: Beam in beams:
				b.pos += b.vel * delta
				b.life -= delta
			if level == 1:
				update_forest(delta)
			else:
				update_resting(delta)
			for b: Beam in beams:
				if b.life > 0 and b.pos.y > FLOOR_Y:
					b.life = 0
					burst(Vector2(b.pos.x, FLOOR_Y), 5, BEAM_COLOR, 120.0, 2.0)
			beams = beams.filter(func(b: Beam) -> bool: return b.life > 0)

	# Taps only count for one frame
	jump_pressed = false
	action_pressed = false
	down_pressed = false

	for p: Particle in particles:
		p.pos += p.vel * delta
		p.life -= delta
	particles = particles.filter(func(p: Particle) -> bool: return p.life > 0)
	for t: FloatText in texts:
		t.pos.y -= 40.0 * delta
		t.life -= delta
	texts = texts.filter(func(t: FloatText) -> bool: return t.life > 0)

	if level != 3:
		cam_x = clampf(grave.x - VIEW_W / 2.0, 0.0, WORLD_W - VIEW_W)
	queue_redraw()


# ---------- Grave and the evaporator ----------

func update_grave(delta: float) -> void:
	var dir := 0
	if key(KEY_D, KEY_RIGHT):
		dir += 1
	if key(KEY_A, KEY_LEFT):
		dir -= 1
	grave.facing = 1 if aim.x >= grave.x else -1 # always face the mouse

	if jump_pressed and grave.on_ground:
		grave.vy = -JUMP_SPEED
		grave.on_ground = false

	grave.vy += GRAVITY * delta
	grave.x += dir * MOVE_SPEED * delta
	grave.y += grave.vy * delta
	if grave.y >= FLOOR_Y:
		grave.y = FLOOR_Y
		grave.vy = 0.0
		grave.on_ground = true
	grave.x = clampf(grave.x, grave.w / 2.0, WORLD_W - grave.w / 2.0)
	grave.walk_time = grave.walk_time + delta if (grave.on_ground and dir != 0) else 0.0
	grave.invuln = maxf(0.0, grave.invuln - delta)

	# Hold to charge (uses battery), let go to fire
	if fire_held():
		grave.charging = true
		grave.charge_time += delta
		if grave.charge_time > TAP_THRESHOLD and grave.battery > 0 and grave.charge < MAX_CHARGE:
			grave.charge = minf(MAX_CHARGE, grave.charge + delta)
			grave.battery = maxf(0.0, grave.battery - BATTERY_DRAIN * delta)
	elif grave.charging:
		fire_beam()
		grave.charging = false
		grave.charge_time = 0.0
		grave.charge = 0.0


func shoulder() -> Vector2:
	return Vector2(grave.x + 10 * grave.facing, grave.y - 58)


func aim_angle() -> float:
	return (aim - shoulder()).angle()


func fire_beam() -> void:
	var power := grave.charge / MAX_CHARGE
	var dir := Vector2.from_angle(aim_angle())
	var b := Beam.new()
	b.pos = shoulder() + dir * 34.0
	b.vel = dir * BEAM_SPEED
	b.damage = roundi(BEAM_MIN_DAMAGE + power * (BEAM_MAX_DAMAGE - BEAM_MIN_DAMAGE))
	b.size = 4.0 + power * 10.0
	beams.append(b)


func hurt_grave(damage: float, color: Color) -> void:
	grave.hp = maxf(0.0, grave.hp - damage)
	grave.invuln = HIT_INVULN
	float_text(Vector2(grave.x, grave.y - grave.h - 34), "-%d" % int(damage), color)
	if grave.hp <= 0:
		status = "lost"
		death_reason = ""
		play_sound("death")


func hits_box(p: Vector2, r: float, cx: float, feet: float, w: float, h: float) -> bool:
	return p.x + r > cx - w / 2 and p.x - r < cx + w / 2 and p.y + r > feet - h and p.y - r < feet


# ---------- effects ----------

func burst(pos: Vector2, count: int, color: Color, speed: float, size: float) -> void:
	for i in count:
		var p := Particle.new()
		p.pos = pos
		p.vel = Vector2.from_angle(randf() * TAU) * speed * randf_range(0.3, 1.0) - Vector2(0, speed * 0.3)
		p.life = randf_range(0.4, 0.9)
		p.max_life = p.life
		p.size = size
		p.color = color
		particles.append(p)


# Rising steam puffs, used when the evaporator hits something
func steam(pos: Vector2, count: int) -> void:
	for i in count:
		var p := Particle.new()
		p.pos = pos + Vector2(randf_range(-10, 10), randf_range(-10, 10))
		p.vel = Vector2(randf_range(-30, 30), -40.0 - randf() * 80.0)
		p.life = randf_range(0.6, 1.4)
		p.max_life = p.life
		p.size = randf_range(6, 14)
		p.color = Color("#dfe8ec")
		particles.append(p)


func float_text(pos: Vector2, s: String, color: Color, life := 0.8) -> void:
	var t := FloatText.new()
	t.pos = pos
	t.text = s
	t.color = color
	t.life = life
	texts.append(t)


# ---------- level 1: the forest ----------

func update_forest(delta: float) -> void:
	update_goblin(delta)

	for b: Beam in beams:
		if b.life <= 0:
			continue
		if goblin.alive and hits_box(b.pos, b.size / 2, goblin.x, goblin.y, goblin.w + 6, goblin.h + 6):
			b.life = 0
			goblin.hp = maxf(0.0, goblin.hp - b.damage)
			goblin.hurt_flash = 0.12
			steam(b.pos, 4 + roundi(b.size))
			float_text(Vector2(goblin.x, goblin.y - goblin.h - 34), "-%d" % b.damage, BEAM_COLOR)
			if goblin.hp <= 0:
				goblin.alive = false
				steam(Vector2(goblin.x, goblin.y - goblin.h / 2), 60)
				burst(Vector2(goblin.x, goblin.y - goblin.h / 2), 30, Color("#d4372b"), 220.0, 5.0)
				float_text(Vector2(goblin.x, goblin.y - 80), "EVAPORATED!", ACCENT, 2.0)
		# Beams can also evaporate lava balls in mid-air
		for ball: LavaBall in lava:
			if not ball.dead and ball.pos.distance_to(b.pos) < LAVA_RADIUS + b.size / 2 + 4:
				ball.dead = true
				steam(b.pos, 6)

	for ball: LavaBall in lava:
		if ball.dead:
			continue
		ball.vel.y += LAVA_GRAVITY * delta
		ball.pos += ball.vel * delta
		if randf() < 0.5:
			var spark := Particle.new()
			spark.pos = ball.pos
			spark.vel = Vector2(0, -20)
			spark.life = 0.3
			spark.max_life = 0.3
			spark.size = 6.0
			spark.color = LAVA_COLOR
			particles.append(spark)
		if grave.invuln <= 0 and hits_box(ball.pos, LAVA_RADIUS, grave.x, grave.y, grave.w, grave.h):
			burst(ball.pos, 14, LAVA_COLOR, 200.0, 3.0)
			ball.dead = true
			hurt_grave(LAVA_DAMAGE, HP_COLOR)
		elif ball.pos.y >= FLOOR_Y:
			burst(Vector2(ball.pos.x, FLOOR_Y), 10, LAVA_COLOR, 160.0, 3.0)
			ball.dead = true
	lava = lava.filter(func(ball: LavaBall) -> bool: return not ball.dead)

	# Getting in the van: checkpoint, refill, drive to the next place
	if status == "playing" and grave.x > VAN_X:
		if goblin.alive:
			show_hint("The van won't start while Destruction Maker is around!")
		else:
			board_van(2, "driving")


func update_goblin(delta: float) -> void:
	if not goblin.alive:
		return
	goblin.hurt_flash = maxf(0.0, goblin.hurt_flash - delta)
	goblin.throw_anim = maxf(0.0, goblin.throw_anim - delta)
	var dx := grave.x - goblin.x
	if not goblin.awake:
		if absf(dx) < GOBLIN_WAKE_RANGE:
			goblin.awake = true
		return
	goblin.facing = 1 if dx >= 0 else -1

	# Keep a throwing distance from Grave
	var side := -1 if dx >= 0 else 1
	var target_x := grave.x + side * GOBLIN_KEEP_DISTANCE
	if absf(target_x - goblin.x) > 10:
		goblin.x += signf(target_x - goblin.x) * GOBLIN_SPEED * delta
		goblin.walk_time += delta
	goblin.x = clampf(goblin.x, 40.0, WORLD_W - 40.0)

	# Random hops
	goblin.hop_cooldown -= delta
	if goblin.hop_cooldown <= 0 and goblin.y >= FLOOR_Y:
		goblin.vy = -520.0
		goblin.hop_cooldown = randf_range(1.2, 3.0)
	goblin.vy += GRAVITY * delta
	goblin.y += goblin.vy * delta
	if goblin.y >= FLOOR_Y:
		goblin.y = FLOOR_Y
		goblin.vy = 0.0

	goblin.throw_cooldown -= delta
	if goblin.throw_cooldown <= 0:
		throw_lava()
		goblin.throw_anim = 0.25
		goblin.throw_cooldown = randf_range(1.3, 2.1)


# Lob an arc that lands roughly where Grave is standing
func throw_lava() -> void:
	var hand := Vector2(goblin.x + 14 * goblin.facing, goblin.y - goblin.h - 6)
	var target_x := grave.x + randf_range(-40, 40)
	var t := LAVA_FLIGHT_TIME * randf_range(0.85, 1.15)
	var ball := LavaBall.new()
	ball.pos = hand
	ball.vel = Vector2((target_x - hand.x) / t, (FLOOR_Y - 30 - hand.y - 0.5 * LAVA_GRAVITY * t * t) / t)
	lava.append(ball)


# ---------- level 2: the resting of the unstable ----------

func update_resting(delta: float) -> void:
	# THE UNSTABLE burst out of the ground near Grave
	spawn_timer -= delta
	if spawn_timer <= 0 and unstable_spawned < UNSTABLE_TOTAL and unstables.size() < UNSTABLE_MAX_ALIVE:
		var side := -1.0 if randf() < 0.5 else 1.0
		var min_x := VAN_PARK_X + VAN_W + 20.0
		var x := grave.x + side * randf_range(150, 450)
		if x < min_x or x > WORLD_W - 40:
			x = grave.x - side * randf_range(150, 450)
		x = clampf(x, min_x, WORLD_W - 40.0)
		var u := Unstable.new()
		u.x = x
		u.hop_cooldown = randf_range(0.6, 1.6)
		u.seed_offset = randf() * 1000.0
		unstables.append(u)
		burst(Vector2(x, FLOOR_Y), 12, Color("#5a4a6a"), 160.0, 4.0)
		unstable_spawned += 1
		spawn_timer = UNSTABLE_SPAWN_INTERVAL * randf_range(0.6, 1.4)

	for u: Unstable in unstables:
		if update_unstable(u, delta):
			hurt_grave(UNSTABLE_DAMAGE, UNSTABLE_COLOR)
		var hittable := not u.emerging or u.t > UNSTABLE_EMERGE_TIME * 0.5
		for b: Beam in beams:
			if b.life > 0 and hittable and hits_box(b.pos, b.size / 2, u.x, u.y, u.w + 6, u.h + 6):
				b.life = 0
				u.hp = maxf(0.0, u.hp - b.damage)
				u.hurt_flash = 0.1
				steam(b.pos, 3 + roundi(b.size / 2))
				float_text(Vector2(u.x, u.y - u.h - 24), "-%d" % b.damage, BEAM_COLOR, 0.7)
		if u.hp <= 0:
			steam(Vector2(u.x, u.y - u.h / 2), 24)
			burst(Vector2(u.x, u.y - u.h / 2), 16, UNSTABLE_COLOR, 200.0, 4.0)
			unstable_evaporated += 1
	unstables = unstables.filter(func(u: Unstable) -> bool: return u.hp > 0)

	# All evaporated: back to the van... where the Keys Keeper is waiting
	if unstable_evaporated >= UNSTABLE_TOTAL and status == "playing":
		show_hint("All the Unstable are evaporated! Get back to the van  <<")
		if grave.x < VAN_PARK_X + VAN_W + 10:
			board_van(3, "title")
			play_sound("clunk")


# Returns true if it bit Grave this frame
func update_unstable(u: Unstable, delta: float) -> bool:
	u.t += delta
	u.hurt_flash = maxf(0.0, u.hurt_flash - delta)
	if u.emerging:
		if u.t >= UNSTABLE_EMERGE_TIME:
			u.emerging = false
			u.t = 0.0
		return false

	# Jittery crawl toward Grave: they can't move in a straight line
	var dir := signf(grave.x - u.x)
	var jitter := sin(u.t * 9.0 + u.seed_offset) * 0.6
	u.x = clampf(u.x + (dir + jitter) * UNSTABLE_SPEED * delta, 20.0, WORLD_W - 20.0)
	u.hop_cooldown -= delta
	if u.hop_cooldown <= 0 and u.y >= FLOOR_Y:
		u.vy = -380.0 - randf() * 200.0
		u.hop_cooldown = randf_range(0.8, 2.2)
	u.vy += GRAVITY * delta
	u.y += u.vy * delta
	if u.y >= FLOOR_Y:
		u.y = FLOOR_Y
		u.vy = 0.0

	var touching := grave.invuln <= 0 \
		and absf(grave.x - u.x) < (grave.w + u.w) / 2 - 4 \
		and u.y > grave.y - grave.h and u.y - u.h < grave.y
	if touching:
		# Bounce back after biting so it can't stay stuck on Grave
		u.x -= dir * 70.0
		u.vy = -360.0
		u.hop_cooldown = 1.2
	return touching


# ---------- level 3: locked in the van ----------

func reset_van_room() -> void:
	hiding_in = -1
	door_open = ""
	door_key = ""
	outside_keys = []
	inside_key = ""
	inside_key_drawer = randi() % 3
	searched = [false, false, false]
	keeper_phase = "quiet"
	keeper_t = 0.0
	keeper_duration = 5.0
	keeper_step_timer = 0.0
	keeper_side = "left"
	thuds = []
	message = "The doors are locked from outside. Listen for footsteps..."
	message_time = 4.0
	unlock_time = 0.0


func key_count() -> int:
	return outside_keys.size() + (1 if inside_key != "" else 0)


func footstep_volume() -> float:
	match keeper_phase:
		"approach":
			return 0.15 + 0.85 * (keeper_t / keeper_duration)
		"near":
			return 1.0
		"leaving":
			return 1.0 - keeper_t / keeper_duration
	return 0.0


func say(s: String, time := 2.5) -> void:
	message = s
	message_time = time


func near_door() -> String:
	if grave.x < LEFT_DOOR_X + SIDE_DOOR_W + 30:
		return "left"
	if grave.x > RIGHT_DOOR_X - 30:
		return "right"
	return ""


func near_drawer() -> int:
	for i in DRAWERS.size():
		if absf(grave.x - DRAWERS[i]) < DRAWER_W / 2:
			return i
	return -1


func near_back_door() -> bool:
	return absf(grave.x - (BACK_DOOR_X + BACK_DOOR_W / 2)) < BACK_DOOR_W / 2


func caught(reason: String) -> void:
	status = "lost"
	death_reason = reason
	play_sound("death")


func advance_keeper(delta: float) -> void:
	keeper_t += delta
	if keeper_t >= keeper_duration:
		keeper_t = 0.0
		match keeper_phase:
			"quiet":
				keeper_phase = "approach"
				keeper_side = "left" if randf() < 0.5 else "right"
				keeper_duration = 3.5
			"approach":
				keeper_phase = "near"
				keeper_duration = 1.6
				play_sound("sting")
			"near":
				keeper_phase = "leaving"
				keeper_duration = 2.2
			_:
				keeper_phase = "quiet"
				keeper_duration = randf_range(4.0, 7.5)
		keeper_step_timer = 0.0
	if keeper_phase != "quiet":
		keeper_step_timer -= delta
		if keeper_step_timer <= 0:
			var v := footstep_volume()
			play_sound("footstep", v)
			if randf() < 0.5:
				play_sound("jangle", v * 0.7)
			var thud := Thud.new()
			thud.side = keeper_side
			thud.volume = v
			thuds.append(thud)
			keeper_step_timer = STEP_INTERVAL
	for t: Thud in thuds:
		t.life -= delta
	thuds = thuds.filter(func(t: Thud) -> bool: return t.life > 0)


# E = action (also W / Space / Up), S = back
func update_van_room(delta: float) -> void:
	message_time = maxf(0.0, message_time - delta)
	if unlock_time > 0:
		unlock_time += delta
		if unlock_time > 1.6:
			status = "won"
			phase_time = 0.0
		return

	advance_keeper(delta)
	var action := action_pressed or jump_pressed
	var back := down_pressed

	# Walking (not while hidden)
	if hiding_in == -1:
		var dir := 0
		if key(KEY_D, KEY_RIGHT):
			dir += 1
		if key(KEY_A, KEY_LEFT):
			dir -= 1
		grave.x = clampf(grave.x + dir * MOVE_SPEED * 0.8 * delta, 110.0, 850.0)
		if dir != 0:
			grave.facing = dir
		grave.walk_time = grave.walk_time + delta if dir != 0 else 0.0
	grave.y = FLOOR_Y

	# Walking away from an open door lets it swing shut
	if door_open != "" and near_door() != door_open:
		door_open = ""
		door_key = ""
		play_sound("clunk")

	if hiding_in != -1:
		if back or action:
			hiding_in = -1
			play_sound("clunk")
			if keeper_phase == "near":
				caught("You climbed out while the Keys Keeper was right outside.")
				return
	elif door_open != "":
		if back:
			door_open = ""
			door_key = ""
			play_sound("clunk")
		elif action and door_key != "":
			if door_key == "red":
				caught("You picked up a RED key. It was the Keys Keeper's trap.")
				return
			if outside_keys.size() < 2:
				outside_keys.append(door_key)
				play_sound("pickup")
				say("You took the %s key!" % door_key.to_upper())
				door_key = ""
			else:
				say("You already have both keys from outside.")
	elif action:
		var drawer := near_drawer()
		var door := near_door()
		if drawer != -1:
			hiding_in = drawer
			play_sound("clunk")
			if not searched[drawer]:
				searched[drawer] = true
				if drawer == inside_key_drawer and inside_key == "":
					inside_key = "blue" if randf() < 0.5 else "green"
					play_sound("pickup")
					say("There was a %s key hidden in this drawer!" % inside_key.to_upper(), 3.0)
		elif door != "":
			if keeper_phase != "quiet":
				caught("You opened a door while the Keys Keeper could still hear you.")
				return
			door_open = door
			var r := randf()
			door_key = "red" if r < RED_CHANCE else ("blue" if randf() < 0.5 else "green")
			play_sound("clunk")
		elif near_back_door():
			if key_count() >= 3:
				unlock_time = 0.0001
				play_sound("clunk")
				say("The back door unlocks!", 3.0)
			else:
				say("The back door is locked. You need 3 keys (%d/3)." % key_count())

	if keeper_phase == "near" and hiding_in == -1:
		caught("The Keys Keeper found you. Hide in a drawer when you hear footsteps!")


# =====================================================================
# Drawing
# =====================================================================

func _draw() -> void:
	if status == "title":
		draw_title_card()
		return
	if level == 3:
		draw_van_room()
		draw_van_hud()
		draw_end_screens()
		return

	if level == 1:
		draw_forest()
	else:
		draw_resting()
	draw_van_exterior(van_world_x() - cam_x)
	if level == 1:
		draw_goblin()
	for u: Unstable in unstables:
		draw_unstable(u)
	if status != "driving" and status != "arriving":
		draw_grave()
	for ball: LavaBall in lava:
		draw_lava(ball)
	for b: Beam in beams:
		draw_beam(b)
	for p: Particle in particles:
		draw_rect(Rect2(p.pos.x - cam_x - p.size / 2, p.pos.y - p.size / 2, p.size, p.size),
			Color(p.color, maxf(0.0, p.life / p.max_life)))
	for t: FloatText in texts:
		text(t.text, t.pos.x - cam_x, t.pos.y, 16, Color(t.color, minf(1.0, t.life * 2)))
	draw_hud()

	# Fade to black as the van drives off
	if status == "driving":
		draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color(0.03, 0.02, 0.05, clampf((phase_time - 1.0) / (DRIVE_TIME - 1.0), 0.0, 1.0)))
	draw_end_screens()


# Text helper: x is the centre (or left / right edge)
func text(s: String, x: float, y: float, size: int, color: Color, align: HorizontalAlignment = HORIZONTAL_ALIGNMENT_CENTER) -> void:
	var font := ThemeDB.fallback_font
	if align == HORIZONTAL_ALIGNMENT_CENTER:
		draw_string(font, Vector2(x - 600, y), s, align, 1200, size, color)
	elif align == HORIZONTAL_ALIGNMENT_RIGHT:
		draw_string(font, Vector2(x - 1200, y), s, align, 1200, size, color)
	else:
		draw_string(font, Vector2(x, y), s, align, -1, size, color)


# Soft glow: a few see-through circles
func glow(pos: Vector2, radius: float, color: Color, strength := 0.25) -> void:
	for i in 4:
		draw_circle(pos, radius * (1.0 + i * 0.35), Color(color, strength / (i + 1)))


# Same "random" number every frame, so the scenery doesn't flicker
func rand(n: float) -> float:
	var v := sin(n * 127.1 + 311.7) * 43758.5453
	return v - floorf(v)


func now() -> float:
	return Time.get_ticks_msec() / 1000.0


func sky(top: Color, bottom: Color) -> void:
	draw_polygon(
		PackedVector2Array([Vector2(0, 0), Vector2(VIEW_W, 0), Vector2(VIEW_W, FLOOR_Y), Vector2(0, FLOOR_Y)]),
		PackedColorArray([top, top, bottom, bottom]))


# ---------- forest ----------

func draw_pine(x: float, base_y: float, h: float, color: Color, trunk: Color) -> void:
	draw_rect(Rect2(x - h * 0.04, base_y - h * 0.25, h * 0.08, h * 0.25), trunk)
	for i in 3:
		var tier_w := h * (0.42 - i * 0.1)
		var bottom := base_y - h * 0.18 - i * h * 0.22
		draw_colored_polygon(PackedVector2Array([
			Vector2(x - tier_w, bottom),
			Vector2(x + tier_w, bottom),
			Vector2(x, bottom - h * 0.42),
		]), color)


# One row of trees; depth < 1 scrolls slower than Grave, so it looks far away
func draw_tree_layer(depth: float, spacing: float, base_y: float, min_h: float, max_h: float, color: Color, trunk: Color, salt: int) -> void:
	var offset := cam_x * depth
	var first := int(floorf(offset / spacing)) - 1
	var last := int(ceilf((offset + VIEW_W) / spacing)) + 1
	for i in range(first, last + 1):
		var x := i * spacing + rand(i + salt) * spacing * 0.6 - offset
		var h := min_h + rand(i * 3 + salt) * (max_h - min_h)
		draw_pine(x, base_y, h, color, trunk)


func draw_forest() -> void:
	sky(Color("#0b1a2a"), Color("#1f3a3a"))
	for i in 60:
		var sx := fposmod(rand(i) * VIEW_W * 2.0 - cam_x * 0.05, VIEW_W)
		draw_rect(Rect2(sx, rand(i + 99) * 200.0, 2, 2), Color(1, 1, 1, 0.7))
	draw_circle(Vector2(780 - cam_x * 0.05, 90), 34, Color("#e8f0d8"))

	var hills := PackedVector2Array([Vector2(0, FLOOR_Y)])
	for x in range(0, int(VIEW_W) + 1, 20):
		var hx := x + cam_x * 0.2
		hills.append(Vector2(x, 300 + sin(hx * 0.006) * 30 + sin(hx * 0.017) * 12))
	hills.append(Vector2(VIEW_W, FLOOR_Y))
	draw_colored_polygon(hills, Color("#16302e"))

	draw_tree_layer(0.35, 70, FLOOR_Y - 20, 120, 190, Color("#173a32"), Color("#173a32"), 1)
	draw_tree_layer(0.6, 110, FLOOR_Y, 180, 280, Color("#1d4a38"), Color("#2a2620"), 50)

	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y), Color("#3a2c1f"))
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, 10), Color("#2f6b3a"))
	var gx := floorf(cam_x / 12.0) * 12.0
	while gx < cam_x + VIEW_W:
		var gh := 4 + rand(gx) * 8
		draw_rect(Rect2(gx - cam_x, FLOOR_Y - gh, 3, gh), Color("#3f8a47"))
		gx += 12
	for i in int(WORLD_W / 90):
		var mx := i * 90 + rand(i + 7) * 60
		if mx < cam_x - 20 or mx > cam_x + VIEW_W + 20:
			continue
		if rand(i + 13) > 0.6:
			draw_rect(Rect2(mx - cam_x - 6, FLOOR_Y - 12, 12, 6), Color("#c0392b"))
			draw_rect(Rect2(mx - cam_x - 2, FLOOR_Y - 6, 4, 6), Color("#e8dcc0"))
		else:
			draw_rect(Rect2(mx - cam_x, FLOOR_Y + 20 + rand(i) * 50, 10, 6), Color("#4a3d30"))


# ---------- the resting of the unstable ----------

func draw_spire(x: float, base_y: float, h: float, w: float, color: Color) -> void:
	draw_colored_polygon(PackedVector2Array([
		Vector2(x - w / 2, base_y),
		Vector2(x - w * 0.15, base_y - h),
		Vector2(x + w * 0.1, base_y - h * 0.9),
		Vector2(x + w / 2, base_y),
	]), color)


func draw_resting_stone(x: float, h: float, tilt: float, salt: int) -> void:
	draw_set_transform(Vector2(x, FLOOR_Y + 4), tilt, Vector2.ONE)
	draw_colored_polygon(PackedVector2Array([
		Vector2(-18, 0), Vector2(-16, -h + 10), Vector2(-6, -h), Vector2(10, -h + 4), Vector2(18, -h + 16), Vector2(18, 0),
	]), Color("#2b2438"))
	draw_rect(Rect2(-16, -h + 14, 6, h - 16), Color("#3a3150"))
	# Pulsing runes
	var rune := Color("#5ff2d6", 0.5 + sin(now() * 2.0 + salt) * 0.3)
	var count := 3 + int(rand(salt) * 3)
	for i in count:
		var ry := -h + 24 + i * 16
		if ry > -10:
			break
		var kind := int(rand(salt + i) * 3)
		if kind == 0:
			draw_rect(Rect2(-4, ry, 8, 3), rune)
		elif kind == 1:
			draw_rect(Rect2(-1, ry - 3, 3, 10), rune)
		else:
			draw_rect(Rect2(-5, ry, 3, 3), rune)
			draw_rect(Rect2(3, ry + 4, 3, 3), rune)
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)


func draw_resting() -> void:
	var time := now()
	sky(Color("#120a24"), Color("#4a2a55"))
	for i in 40:
		var sx := fposmod(rand(i + 500) * VIEW_W * 2.0 - cam_x * 0.04, VIEW_W)
		draw_rect(Rect2(sx, rand(i + 900) * 180.0, 2, 2), Color(0.86, 0.78, 1.0, 0.5))

	# Eclipsed moon with a glowing ring
	var moon := Vector2(560 - cam_x * 0.04, 120)
	glow(moon, 50, Color("#5ff2d6"), 0.12)
	draw_circle(moon, 47, Color("#8ffbe6"))
	draw_circle(moon, 44, Color("#0d0718"))

	# Crystal spires (two parallax rows)
	var far_off := cam_x * 0.25
	var far_first := int(floorf(far_off / 90.0)) - 1
	for i in range(far_first, far_first + int(VIEW_W / 90.0) + 3):
		draw_spire(i * 90 + rand(i + 40) * 50 - far_off, FLOOR_Y - 30, 80 + rand(i + 41) * 120, 40 + rand(i + 42) * 30, Color("#1e1233"))
	var near_off := cam_x * 0.55
	var near_first := int(floorf(near_off / 160.0)) - 1
	for i in range(near_first, near_first + int(VIEW_W / 160.0) + 3):
		draw_spire(i * 160 + rand(i + 70) * 80 - near_off, FLOOR_Y, 120 + rand(i + 71) * 150, 60 + rand(i + 72) * 40, Color("#2a1840"))

	# Resting stones
	for i in int(WORLD_W / 230):
		var wx := 380 + i * 230 + rand(i + 300) * 90
		if wx < cam_x - 60 or wx > cam_x + VIEW_W + 60:
			continue
		draw_resting_stone(wx - cam_x, 50 + rand(i + 301) * 60, (rand(i + 302) - 0.5) * 0.25, i + 303)

	# Ashen ground with glowing cracks
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y), Color("#1d1726"))
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, 6), Color("#2f2640"))
	var crack := Color(UNSTABLE_COLOR, 0.55 + sin(time * 1.5) * 0.2)
	for i in int(WORLD_W / 140):
		var wx := i * 140 + rand(i + 600) * 100
		if wx < cam_x - 80 or wx > cam_x + VIEW_W + 80:
			continue
		var x := wx - cam_x
		var y := FLOOR_Y + 14 + rand(i + 601) * 60
		draw_polyline(PackedVector2Array([Vector2(x, y), Vector2(x + 14, y + 6), Vector2(x + 26, y + 2), Vector2(x + 44, y + 10)]), crack, 2.0)

	# Low drifting mist
	for i in 6:
		var mist_x := fposmod(i * 260 + time * (12 + i * 4) - cam_x * 0.8, VIEW_W + 400) - 200
		for j in 3:
			draw_circle(Vector2(mist_x, FLOOR_Y - 10), 160 - j * 50, Color(0.78, 0.67, 1.0, 0.04))


# ---------- the van (outside) ----------

func van_world_x() -> float:
	if level == 1:
		var t := maxf(0.0, phase_time - 0.4) if status == "driving" else 0.0
		return VAN_X + t * t * 400
	if status == "arriving":
		var k := minf(1.0, phase_time / ARRIVE_TIME)
		var ease := 1.0 - pow(1.0 - k, 3)
		return VAN_PARK_X - 700 * (1.0 - ease)
	return VAN_PARK_X


func draw_van_exterior(x: float) -> void:
	var y := FLOOR_Y
	draw_rect(Rect2(x, y - 92, VAN_W - 40, 74), Color("#e9ecef"))
	draw_colored_polygon(PackedVector2Array([
		Vector2(x + VAN_W - 40, y - 92), Vector2(x + VAN_W - 10, y - 56), Vector2(x + VAN_W, y - 50),
		Vector2(x + VAN_W, y - 18), Vector2(x + VAN_W - 40, y - 18),
	]), Color("#e9ecef"))
	draw_colored_polygon(PackedVector2Array([
		Vector2(x + VAN_W - 38, y - 86), Vector2(x + VAN_W - 14, y - 58), Vector2(x + VAN_W - 38, y - 58),
	]), Color("#7fb3c9"))
	draw_rect(Rect2(x, y - 46, VAN_W, 6), ACCENT)
	text("EAP", x + 70, y - 58, 22, ACCENT)
	for wx in [x + 38, x + VAN_W - 36]:
		draw_circle(Vector2(wx, y - 14), 16, Color("#151515"))
		draw_circle(Vector2(wx, y - 14), 6, Color("#888888"))
	draw_rect(Rect2(x + VAN_W - 6, y - 46, 6, 8), Color("#ffe9a0"))


# ---------- Grave ----------

func draw_grave() -> void:
	var x := roundf(grave.x - cam_x)
	var feet := roundf(grave.y)
	var swing := sin(grave.walk_time * 14.0) * 8.0
	var step := swing / 2.0 if grave.on_ground else 0.0

	# Blink while safe after a hit
	if grave.invuln > 0 and int(grave.invuln * 12) % 2 == 0:
		return

	draw_set_transform(Vector2(x, FLOOR_Y + 2), 0, Vector2(1, 0.22))
	draw_circle(Vector2.ZERO, 22, Color(0, 0, 0, 0.3))

	draw_set_transform(Vector2(x, feet), 0, Vector2(grave.facing, 1))
	draw_rect(Rect2(-12, -34, 10, 32 + step), Color("#2b2f3a")) # legs
	draw_rect(Rect2(2, -34, 10, 32 - step), Color("#2b2f3a"))
	draw_rect(Rect2(-14 + step, -4, 14, 5), Color("#111111")) # boots
	draw_rect(Rect2(-step, -4, 14, 5), Color("#111111"))
	draw_rect(Rect2(-20, -64, 7, 26 - swing / 3.0), Color("#c9cdd6")) # back arm
	draw_rect(Rect2(-16, -66, 32, 34), Color("#e6e9ef")) # EAP Corporation jacket
	draw_rect(Rect2(-16, -50, 32, 4), ACCENT) # company stripe
	draw_rect(Rect2(4, -62, 9, 11), Color.WHITE) # ID badge
	draw_rect(Rect2(5, -61, 7, 3), ACCENT)
	draw_rect(Rect2(-11, -86, 22, 20), Color("#e0b48a")) # head
	draw_rect(Rect2(-12, -90, 24, 7), Color("#1a1a1a")) # hair
	draw_rect(Rect2(-12, -86, 6, 8), Color("#1a1a1a"))
	draw_rect(Rect2(4, -79, 3, 3), Color("#111111")) # eye
	draw_rect(Rect2(2, -82, 7, 2), Color("#111111")) # eyebrow

	draw_evaporator(x, feet)
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	text(grave.name, x, feet - grave.h - 16, 14, ACCENT)


# Front arm holding the evaporator, pointed at the mouse
func draw_evaporator(x: float, feet: float) -> void:
	var a := aim_angle() if level != 3 else (0.0 if grave.facing == 1 else PI)
	var flip := -1.0 if cos(a) < 0 else 1.0 # keep it upright when aiming left
	draw_set_transform(Vector2(x + 10 * grave.facing, feet - 58), a, Vector2(1, flip))
	draw_rect(Rect2(0, -4, 14, 8), Color("#e6e9ef")) # sleeve
	draw_rect(Rect2(12, -3, 6, 6), Color("#e0b48a")) # hand
	draw_rect(Rect2(14, -6, 22, 12), Color("#5b6275")) # body
	draw_rect(Rect2(16, 6, 6, 6), Color("#3a4050")) # grip
	draw_rect(Rect2(34, -3, 5, 6), BEAM_COLOR) # emitter
	if grave.charging and grave.charge > 0:
		var power := grave.charge / MAX_CHARGE
		var r := 4 + power * 10 + sin(now() * 25.0) * 1.5
		glow(Vector2(40, 0), r, BEAM_COLOR, 0.15 + power * 0.2)
		draw_circle(Vector2(40, 0), r, Color(BEAM_COLOR, 0.35 + power * 0.5))


func draw_beam(b: Beam) -> void:
	var head := b.pos - Vector2(cam_x, 0)
	var tail := head - b.vel.normalized() * (18.0 + b.size * 2.0)
	draw_line(tail, head, Color(BEAM_COLOR, 0.3), b.size + 8.0)
	draw_line(tail, head, BEAM_COLOR, b.size)
	draw_line(tail, head, Color("#fffbe0"), maxf(1.5, b.size / 3.0))


# ---------- Destruction Maker ----------

func draw_goblin() -> void:
	if not goblin.alive:
		return
	var x := roundf(goblin.x - cam_x)
	var feet := roundf(goblin.y)
	var step := sin(goblin.walk_time * 16.0) * 3.0
	var white := goblin.hurt_flash > 0
	var skin := Color.WHITE if white else Color("#d4372b")

	draw_set_transform(Vector2(x, FLOOR_Y + 2), 0, Vector2(1, 0.18))
	draw_circle(Vector2.ZERO, 16 * GOBLIN_SCALE, Color(0, 0, 0, 0.3))

	# The drawing is made at small size and scaled up
	draw_set_transform(Vector2(x, feet), 0, Vector2(goblin.facing * GOBLIN_SCALE, GOBLIN_SCALE))
	draw_rect(Rect2(-8, -12, 6, 12 + step), skin) # legs
	draw_rect(Rect2(2, -12, 6, 12 - step), skin)
	var tunic := Color.WHITE if white else Color("#3a2618")
	draw_rect(Rect2(-11, -28, 22, 18), tunic) # ragged tunic
	draw_rect(Rect2(-11, -10, 5, 3), tunic)
	draw_rect(Rect2(1, -10, 6, 3), tunic)
	draw_rect(Rect2(-10, -42, 20, 15), skin) # head
	draw_colored_polygon(PackedVector2Array([Vector2(-10, -38), Vector2(-20, -44), Vector2(-10, -32)]), skin) # ears
	draw_colored_polygon(PackedVector2Array([Vector2(10, -38), Vector2(20, -44), Vector2(10, -32)]), skin)
	draw_rect(Rect2(1, -38, 4, 3), Color("#ffd23a")) # glowing eyes
	draw_rect(Rect2(-5, -38, 3, 3), Color("#ffd23a"))
	draw_rect(Rect2(-3, -31, 9, 2), Color("#1a1a1a")) # grin
	if goblin.throw_anim > 0:
		draw_rect(Rect2(8, -48, 5, 22), skin) # arm raised to throw
	else:
		draw_rect(Rect2(9, -26, 5, 12), skin)
		draw_circle(Vector2(12, -14), 7, LAVA_COLOR) # lava ball in hand
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)

	if goblin.awake:
		draw_rect(Rect2(x - 23, feet - goblin.h - 26, 46, 5), Color(0, 0, 0, 0.6))
		draw_rect(Rect2(x - 23, feet - goblin.h - 26, 46 * goblin.hp / GOBLIN_MAX_HP, 5), HP_COLOR)


func draw_lava(ball: LavaBall) -> void:
	var p := ball.pos - Vector2(cam_x, 0)
	glow(p, LAVA_RADIUS, LAVA_COLOR, 0.2)
	draw_circle(p, LAVA_RADIUS, Color("#c4260a"))
	draw_circle(p, LAVA_RADIUS * 0.7, Color("#ffa21a"))
	draw_circle(p - Vector2(3, 3), LAVA_RADIUS * 0.3, Color("#fff3a0"))


# ---------- THE UNSTABLE ----------

# Wobbly blob outline; points below the ground are flattened (so it looks like it's coming out)
func blob_points(cx: float, cy: float, r: float, seed_offset: float) -> PackedVector2Array:
	var time := now()
	var pts := PackedVector2Array()
	for i in 18:
		var a := i / 18.0 * TAU
		var wobble := sin(a * 3 + time * 6 + seed_offset) * 0.12 + sin(a * 5 - time * 9 + seed_offset) * 0.07
		var rr := r * (1 + wobble)
		pts.append(Vector2(cx + cos(a) * rr, minf(cy + sin(a) * rr * 0.85, FLOOR_Y)))
	return pts


func draw_unstable(u: Unstable) -> void:
	var x := u.x - cam_x
	var time := now()

	# Glowing crack where it's coming out
	if u.emerging:
		draw_polyline(PackedVector2Array([
			Vector2(x - 30, FLOOR_Y + 2), Vector2(x - 12, FLOOR_Y - 2), Vector2(x, FLOOR_Y + 4),
			Vector2(x + 14, FLOOR_Y - 1), Vector2(x + 30, FLOOR_Y + 3),
		]), UNSTABLE_COLOR, 3.0)

	var rise := minf(1.0, u.t / UNSTABLE_EMERGE_TIME) if u.emerging else 1.0
	var feet := u.y + (1.0 - rise) * (u.h + 10)
	var r := u.w / 2
	var cy := feet - r * 0.9
	if cy - r > FLOOR_Y:
		return # still fully underground

	# Flicker: sometimes it glitches sideways and fades (it's unstable!)
	var glitching := sin(time * 23 + u.seed_offset) > 0.93
	var gx := randf_range(-4, 4) if glitching else 0.0
	var alpha := 0.6 if glitching else 1.0

	# Cyan / pink ghost copies, then the glowing body
	draw_colored_polygon(blob_points(x + gx - 3, cy, r, u.seed_offset), Color(0.25, 0.95, 1.0, 0.35))
	draw_colored_polygon(blob_points(x + gx + 3, cy, r, u.seed_offset), Color(1.0, 0.25, 0.82, 0.35))
	glow(Vector2(x + gx, minf(cy, FLOOR_Y - 4)), r * 0.8, UNSTABLE_COLOR, 0.12)
	var body := Color.WHITE if u.hurt_flash > 0 else UNSTABLE_COLOR
	draw_colored_polygon(blob_points(x + gx, cy, r, u.seed_offset), Color(body, alpha))
	if cy - 4 < FLOOR_Y:
		draw_circle(Vector2(x + gx, cy - 4), r * 0.45, Color(Color("#f6d7ff"), 0.5 * alpha)) # bright core

	if not u.emerging:
		# Little feeler strands
		for i in range(-2, 3):
			var sx := x + gx + i * 7
			draw_line(Vector2(sx, cy + r * 0.6), Vector2(sx + sin(time * 8 + i + u.seed_offset) * 4, feet), UNSTABLE_COLOR, 2.0)

	# One big eye that follows Grave
	if cy - 3 < FLOOR_Y - 6:
		var look := clampf((grave.x - u.x) / 200.0, -1.0, 1.0)
		draw_set_transform(Vector2(x + gx + look * 4, cy - 3), 0, Vector2(1, 9.0 / 8.0))
		draw_circle(Vector2.ZERO, 8, Color.WHITE)
		draw_set_transform(Vector2(x + gx + look * 7, cy - 2), 0, Vector2(1, 2))
		draw_circle(Vector2.ZERO, 3, Color("#14051f"))
		draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)

	if not u.emerging and u.hp < UNSTABLE_MAX_HP:
		draw_rect(Rect2(x - 16, feet - u.h - 14, 32, 4), Color(0, 0, 0, 0.6))
		draw_rect(Rect2(x - 16, feet - u.h - 14, 32 * u.hp / UNSTABLE_MAX_HP, 4), HP_COLOR)


# ---------- HUD and screens ----------

func bar(x: float, y: float, w: float, h: float, frac: float, color: Color, label: String) -> void:
	draw_rect(Rect2(x, y, w, h), Color(0, 0, 0, 0.6))
	draw_rect(Rect2(x + 2, y + 2, maxf(0.0, (w - 4) * frac), h - 4), color)
	text(label, x + 6, y + h - 5, 11, Color.WHITE, HORIZONTAL_ALIGNMENT_LEFT)


func draw_hud() -> void:
	draw_rect(Rect2(12, 12, 250, 98), Color(0.04, 0.05, 0.09, 0.7))
	text("GRAVE", 22, 32, 16, ACCENT, HORIZONTAL_ALIGNMENT_LEFT)
	bar(22, 40, 230, 18, grave.hp / GRAVE_MAX_HP, HP_COLOR, "HEALTH %d" % ceili(grave.hp))
	if grave.battery > 0:
		bar(22, 62, 230, 18, grave.battery / BATTERY_MAX, BATTERY_COLOR, "BATTERY %d%%" % ceili(grave.battery))
	else:
		bar(22, 62, 230, 18, 0.0, Color(0.33, 0.33, 0.33), "BATTERY EMPTY - NO CHARGING")
	bar(22, 84, 230, 18, grave.charge / MAX_CHARGE, BEAM_COLOR, "CHARGE")

	if level == 1 and goblin.awake and goblin.alive:
		text(goblin.name, VIEW_W / 2, 30, 14, Color("#ff8a5a"))
		bar((VIEW_W - 420) / 2, 36, 420, 16, goblin.hp / GOBLIN_MAX_HP, HP_COLOR, "")
	if level == 2:
		draw_rect(Rect2(VIEW_W - 262, 12, 250, 54), Color(0.04, 0.05, 0.09, 0.7))
		text(LEVEL_NAMES[2], VIEW_W - 22, 32, 12, Color("#cfa8ff"), HORIZONTAL_ALIGNMENT_RIGHT)
		text("UNSTABLE EVAPORATED %d/%d" % [unstable_evaporated, UNSTABLE_TOTAL], VIEW_W - 22, 56, 16, Color.WHITE, HORIZONTAL_ALIGNMENT_RIGHT)

	text("A/D move   W/Space jump   Right-click (or F) shoot, hold to charge   M sound", VIEW_W - 14, VIEW_H - 12, 12, Color("#9aa3b5"), HORIZONTAL_ALIGNMENT_RIGHT)
	if hint_time > 0:
		text(hint, VIEW_W / 2, 150, 18, Color("#ffcf5a"))


func draw_overlay(title: String, sub: String, color: Color, detail := "") -> void:
	draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color(0.02, 0.03, 0.05, 0.7))
	text(title, VIEW_W / 2, VIEW_H / 2 - 10, 44, color)
	if detail != "":
		text(detail, VIEW_W / 2, VIEW_H / 2 + 28, 16, Color("#e6e9ef"))
	text(sub, VIEW_W / 2, VIEW_H / 2 + (60 if detail != "" else 30), 18, Color("#e6e9ef"))


func draw_end_screens() -> void:
	if status == "lost":
		var where := "Press R or click to try again" if checkpoint == 1 else "Press R or click to restart from the van"
		if level == 3:
			draw_overlay("THE KEYS KEEPER GOT YOU", where, HP_COLOR, death_reason)
		else:
			draw_overlay("GRAVE WAS MELTED", where, HP_COLOR)
	elif status == "won":
		draw_overlay("YOU ESCAPED THE VAN", "To be continued...  Press R or click to play again", ACCENT)


func draw_title_card() -> void:
	draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color("#07040d"))
	var a := clampf(minf(phase_time / 0.6, (TITLE_TIME - phase_time) / 0.6), 0.0, 1.0)
	var color := ACCENT
	var line := ""
	if next_level == 2:
		color = Color("#cfa8ff")
		line = "Something is moving under the ground..."
	elif next_level == 3:
		color = KEEPER_EYES
		line = "*click* ... the van doors lock from the outside."
		draw_keys_keeper(VIEW_W / 2, VIEW_H + 130, 1.6, a * 0.8, Color("#241a30"))
	text("Checkpoint - health and battery refilled", VIEW_W / 2, VIEW_H / 2 - 70, 16, Color("#9aa3b5", a))
	glow(Vector2(VIEW_W / 2, VIEW_H / 2 - 14), 60, color, 0.05 * a)
	text(LEVEL_NAMES[next_level], VIEW_W / 2, VIEW_H / 2, 40, Color(color, a))
	text(line, VIEW_W / 2, VIEW_H / 2 + 44, 18, Color("#e6e9ef", a))


# ---------- inside the van ----------

func draw_key(pos: Vector2, color_name: String, scale := 1.0) -> void:
	var c: Color = KEY_COLORS[color_name]
	draw_set_transform(pos, 0, Vector2(scale, scale))
	glow(Vector2(-4, 0), 10, c, 0.15)
	draw_arc(Vector2(-10, 0), 7, 0, TAU, 20, c, 4.0)
	draw_rect(Rect2(-3, -2, 20, 4), c)
	draw_rect(Rect2(10, 2, 3, 5), c)
	draw_rect(Rect2(15, 2, 3, 4), c)
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)


func draw_keys_keeper(x: float, feet: float, s: float, alpha := 1.0, body := Color("#0b0810")) -> void:
	var b := Color(body, alpha)
	draw_set_transform(Vector2(x, feet), 0, Vector2(s, s))
	draw_rect(Rect2(-12, -70, 8, 70), b) # long legs
	draw_rect(Rect2(4, -70, 8, 70), b)
	draw_colored_polygon(PackedVector2Array([Vector2(-22, -70), Vector2(22, -70), Vector2(16, -150), Vector2(-16, -150)]), b)
	draw_rect(Rect2(-30, -148, 8, 90), b) # long arms
	draw_rect(Rect2(22, -148, 8, 90), b)
	draw_circle(Vector2(0, -168), 20, b) # head
	for ex in [-8.0, 8.0]: # keyhole eyes
		glow(Vector2(ex, -170), 5, KEEPER_EYES, 0.15 * alpha)
		draw_circle(Vector2(ex, -172), 4, Color(KEEPER_EYES, alpha))
		draw_rect(Rect2(ex - 1.5, -172, 3, 9), Color(KEEPER_EYES, alpha))
	# Key ring around the waist with hanging keys
	draw_set_transform(Vector2(x, feet - 82 * s), 0, Vector2(s, s * 8.0 / 26.0))
	draw_arc(Vector2.ZERO, 26, 0, TAU, 32, Color(0.54, 0.56, 0.6, alpha), 3.0)
	draw_set_transform(Vector2(x, feet), 0, Vector2(s, s))
	var ring := ["red", "blue", "red", "green", "red"]
	for i in ring.size():
		var kc := Color(KEY_COLORS[ring[i]], alpha)
		draw_rect(Rect2(-22 + i * 10, -78, 3, 16), kc)
		draw_rect(Rect2(-23 + i * 10, -64, 5, 3), kc)
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)


func outside_view(x: float, y: float, w: float, h: float) -> void:
	draw_polygon(
		PackedVector2Array([Vector2(x, y), Vector2(x + w, y), Vector2(x + w, y + h), Vector2(x, y + h)]),
		PackedColorArray([Color("#2d1846"), Color("#2d1846"), Color("#4a2a55"), Color("#4a2a55")]))


func draw_side_door(side: String) -> void:
	var x := LEFT_DOOR_X if side == "left" else RIGHT_DOOR_X
	var w := SIDE_DOOR_W
	var top := FLOOR_Y - 230
	var h := 230.0
	draw_rect(Rect2(x - 6, top - 6, w + 12, h + 6), Color("#15181e"))

	if door_open == side:
		# Doorway looking out at THE RESTING OF THE UNSTABLE
		outside_view(x, top, w, h)
		draw_rect(Rect2(x, FLOOR_Y - 20, w, 20), Color("#1d1726"))
		if door_key != "":
			var key_x := x + 30 if side == "left" else x + w - 30
			draw_key(Vector2(key_x, FLOOR_Y - 26 + sin(now() * 3) * 3), door_key, 1.3)
		draw_rect(Rect2(x + w - 16 if side == "left" else x, top, 16, h), Color("#4a505c"))
		return

	draw_rect(Rect2(x, top, w, h), Color("#4a505c"))
	draw_rect(Rect2(x + 8, top + 8, w - 16, h - 16), Color("#3a3f4a"), false, 3.0)
	# Small window; the Keys Keeper's face shows in it during footsteps
	var wx := x + 20
	var wy := top + 24
	var ww := w - 40
	outside_view(wx, wy, ww, 60)
	if keeper_side == side and keeper_phase != "quiet":
		var v := minf(1.0, footstep_volume() * 1.2)
		draw_circle(Vector2(wx + ww / 2, wy + 48), 15, Color("#0b0810", v))
		for ex in [-6.0, 6.0]:
			draw_circle(Vector2(wx + ww / 2 + ex, wy + 44), 3, Color(KEEPER_EYES, v))
			draw_rect(Rect2(wx + ww / 2 + ex - 1, wy + 44, 2, 6), Color(KEEPER_EYES, v))
	draw_rect(Rect2(wx, wy, ww, 60), Color("#20242c"), false, 4.0)
	draw_rect(Rect2(x + w - 24 if side == "left" else x + 12, top + 120, 12, 5), Color("#9aa3b5")) # handle


func draw_back_door() -> void:
	var x := BACK_DOOR_X
	var w := BACK_DOOR_W
	var top := FLOOR_Y - 250
	var h := 250.0
	draw_rect(Rect2(x - 6, top - 6, w + 12, h + 6), Color("#15181e"))
	var gap := minf(w / 2, maxf(0.0, unlock_time - 0.6) * 90) if unlock_time > 0 else 0.0
	if gap > 0:
		outside_view(x, top, w, h)
		draw_rect(Rect2(x, top, w, h), Color(0.91, 0.97, 1.0, minf(0.6, gap / 60)))
	draw_rect(Rect2(x, top, w / 2 - 2 - gap, h), Color("#565d6b"))
	draw_rect(Rect2(x + w / 2 + 2 + gap, top, w / 2 - 2 - gap, h), Color("#565d6b"))
	if gap > 0:
		return
	outside_view(x + 10, top + 20, w / 2 - 22, 50)
	outside_view(x + w / 2 + 12, top + 20, w / 2 - 22, 50)

	# Big padlock with three keyholes
	var lx := x + w / 2
	var ly := top + 140
	draw_arc(Vector2(lx, ly - 14), 16, PI, TAU, 16, Color("#b9bec9"), 6.0)
	draw_rect(Rect2(lx - 30, ly - 14, 60, 48), Color("#c9a227"))
	var slots := [
		outside_keys[0] if outside_keys.size() > 0 else "",
		inside_key,
		outside_keys[1] if outside_keys.size() > 1 else "",
	]
	for i in 3:
		var sx := lx - 18 + i * 18
		var c: Color = KEY_COLORS[slots[i]] if slots[i] != "" else Color("#3a2c08")
		draw_circle(Vector2(sx, ly + 4), 4, c)
		draw_rect(Rect2(sx - 1.5, ly + 4, 3, 10), c)
	text("UNLOCKED" if unlock_time > 0 else "LOCKED", lx, top + 210, 11, Color("#e6e9ef"))


func draw_drawer(i: int) -> void:
	var cx: float = DRAWERS[i]
	var x := cx - DRAWER_W / 2
	var top := FLOOR_Y - 96
	draw_rect(Rect2(x, top, DRAWER_W, 96), Color("#3d4350"))
	draw_rect(Rect2(x - 6, top - 8, DRAWER_W + 12, 8), Color("#2b303a")) # counter top
	for d in 2:
		var dy := top + 8 + d * 44
		var ajar := 6.0 if (hiding_in == i and d == 1) else 0.0
		draw_rect(Rect2(x + 6 - ajar, dy, DRAWER_W - 12, 38), Color("#565d6b"))
		draw_rect(Rect2(cx - 14 - ajar, dy + 16, 28, 5), Color("#9aa3b5"))
		if ajar > 0:
			# Grave peeking out through the gap
			draw_rect(Rect2(x + 6 - ajar, dy - 3, DRAWER_W - 12, 4), Color("#07080b"))
			if sin(now() * 2.3) < 0.97:
				draw_rect(Rect2(cx - 9, dy - 3, 4, 3), Color.WHITE)
				draw_rect(Rect2(cx + 5, dy - 3, 4, 3), Color.WHITE)
	if searched[i]:
		text("searched", cx, FLOOR_Y + 16, 10, Color(1, 1, 1, 0.25))


func draw_van_room() -> void:
	var vol := footstep_volume()

	# Small shake on each step
	var shake := 0.0
	for t: Thud in thuds:
		if t.life > 0.45:
			shake += t.volume * 3.0
	draw_set_transform(Vector2(randf_range(-0.5, 0.5) * shake, randf_range(-0.5, 0.5) * shake), 0, Vector2.ONE)

	# Walls with panels and rivets
	draw_rect(Rect2(-10, -10, VIEW_W + 20, VIEW_H + 20), Color("#2a2f38"))
	for x in range(0, int(VIEW_W), 120):
		draw_rect(Rect2(x, 70, 120, FLOOR_Y - 70), Color("#2e343e") if (x / 120) % 2 == 0 else Color("#2a2f38"))
		for y in range(90, int(FLOOR_Y), 60):
			draw_rect(Rect2(x + 6, y, 4, 4), Color("#3d4450"))
			draw_rect(Rect2(x + 110, y, 4, 4), Color("#3d4450"))

	# Ceiling light that flickers more when he's close
	draw_rect(Rect2(0, 0, VIEW_W, 70), Color("#1c2028"))
	var flicker := 0.25 if randf() < 0.04 + vol * 0.25 else 1.0
	draw_rect(Rect2(VIEW_W / 2 - 90, 62, 180, 8), Color(1, 0.96, 0.84, 0.9 * flicker))
	for i in 4:
		draw_circle(Vector2(VIEW_W / 2, 70), 100 + i * 90, Color(1, 0.96, 0.84, 0.03 * flicker))

	draw_side_door("left")
	draw_side_door("right")
	draw_back_door()
	for i in DRAWERS.size():
		draw_drawer(i)

	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y), Color("#1b1e24"))
	for x in range(0, int(VIEW_W), 24):
		draw_rect(Rect2(x, FLOOR_Y + 6, 12, 3), Color("#262a32"))

	if hiding_in == -1 and unlock_time <= 0:
		draw_grave()
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)

	# Darker when he's near
	if vol > 0:
		draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color(0.02, 0.01, 0.04, vol * 0.35))

	# THUD marks on the side the footsteps come from (you can see the sound)
	for t: Thud in thuds:
		var y := FLOOR_Y + 50 - (0.6 - t.life) * 30
		text("THUD", 95.0 if t.side == "left" else 865.0, y, int(14 + t.volume * 22), Color("#ffcf5a", minf(1.0, t.life * 2)))


func van_prompt() -> String:
	if unlock_time > 0:
		return ""
	if hiding_in != -1:
		return "[S] Climb out of the drawer"
	if door_open != "":
		if door_key == "":
			return "[S] Close the door"
		return "[E] Pick up the %s key     [S] Close the door" % door_key.to_upper()
	if near_drawer() != -1:
		return "[E] Hide in the drawer"
	if near_door() != "":
		return "[E] Open the %s door" % near_door()
	if near_back_door():
		return "[E] Try the back door"
	return ""


func draw_van_hud() -> void:
	# Keys
	draw_rect(Rect2(VIEW_W - 262, 12, 250, 92), Color(0.04, 0.05, 0.09, 0.75))
	text("KEYS %d/3" % key_count(), VIEW_W - 250, 32, 13, Color("#e6e9ef"), HORIZONTAL_ALIGNMENT_LEFT)
	text("outside %d/2   inside %d/1" % [outside_keys.size(), 1 if inside_key != "" else 0], VIEW_W - 250, 50, 11, Color("#9aa3b5"), HORIZONTAL_ALIGNMENT_LEFT)
	var slots := [
		outside_keys[0] if outside_keys.size() > 0 else "",
		outside_keys[1] if outside_keys.size() > 1 else "",
		inside_key,
	]
	for i in 3:
		if slots[i] != "":
			draw_key(Vector2(VIEW_W - 220 + i * 70, 78), slots[i])
		else:
			draw_rect(Rect2(VIEW_W - 240 + i * 70, 66, 46, 24), Color("#444b58"), false, 2.0)

	# Footsteps meter
	var vol := footstep_volume()
	draw_rect(Rect2(VIEW_W / 2 - 160, 82, 320, 34), Color(0.04, 0.05, 0.09, 0.75))
	draw_rect(Rect2(VIEW_W / 2 - 150, 98, 300, 10), Color("#3a2f1a"))
	draw_rect(Rect2(VIEW_W / 2 - 150, 98, 300 * vol, 10), HP_COLOR if vol > 0.75 else Color("#ffcf5a"))
	text("FOOTSTEPS - HIDE!" if vol > 0 else "QUIET - safe to open a door", VIEW_W / 2, 94, 11,
		Color("#ffcf5a") if vol > 0 else Color("#6f7686"))

	if message_time > 0:
		text(message, VIEW_W / 2, 150, 16, Color("#e6e9ef", minf(1.0, message_time)))
	var p := van_prompt()
	if p != "":
		draw_rect(Rect2(VIEW_W / 2 - 250, VIEW_H - 40, 500, 26), Color(0.04, 0.05, 0.09, 0.75))
		text(p, VIEW_W / 2, VIEW_H - 22, 13, ACCENT)


# =====================================================================
# Sound: everything is generated here, no audio files needed
# =====================================================================

const SR := 16000 # sample rate

var sounds := {}
var sfx_players: Array = []
var next_player := 0
var ambience_player := AudioStreamPlayer.new()
var dread_player := AudioStreamPlayer.new()
var current_mood := 0
var spooky_timer := 4.0
var heartbeat_timer := 0.0


func make_wav(samples: PackedFloat32Array, loop := false) -> AudioStreamWAV:
	var bytes := PackedByteArray()
	bytes.resize(samples.size() * 2)
	for i in samples.size():
		bytes.encode_s16(i * 2, int(clampf(samples[i], -1.0, 1.0) * 32767.0))
	var wav := AudioStreamWAV.new()
	wav.format = AudioStreamWAV.FORMAT_16_BITS
	wav.mix_rate = SR
	wav.stereo = false
	wav.data = bytes
	if loop:
		wav.loop_mode = AudioStreamWAV.LOOP_FORWARD
		wav.loop_begin = 0
		wav.loop_end = samples.size()
	return wav


func samples_for(seconds: float) -> PackedFloat32Array:
	var s := PackedFloat32Array()
	s.resize(int(seconds * SR))
	return s


# Heavy thud: a low sine dropping in pitch, plus a muffled hit
func gen_footstep() -> PackedFloat32Array:
	var s := samples_for(0.3)
	var ph := 0.0
	var lp := 0.0
	for i in s.size():
		var t := float(i) / SR
		var f := 95.0 * pow(40.0 / 95.0, minf(t / 0.18, 1.0))
		ph += TAU * f / SR
		lp += (randf_range(-1, 1) - lp) * 0.15
		s[i] = sin(ph) * exp(-t * 18.0) * 0.8 + lp * exp(-t * 30.0) * 0.9
	return s


# Metallic key-ring jangle
func gen_jangle() -> PackedFloat32Array:
	var s := samples_for(0.3)
	for k in 4:
		var start := int((k * 0.035 + randf() * 0.02) * SR)
		var f := randf_range(2400, 4600)
		for i in range(start, s.size()):
			var t := float(i - start) / SR
			s[i] += sin(TAU * f * t) * exp(-t * 35.0) * 0.18
	return s


func gen_heartbeat() -> PackedFloat32Array:
	var s := samples_for(0.4)
	for k in 2:
		var start := int(k * 0.16 * SR)
		var ph := 0.0
		for i in range(start, s.size()):
			var t := float(i - start) / SR
			ph += TAU * (62.0 * pow(38.0 / 62.0, minf(t / 0.12, 1.0))) / SR
			s[i] += sin(ph) * exp(-t * 25.0) * (0.9 if k == 0 else 0.65)
	return s


# Scare stab: clashing saw-tooth notes
func gen_sting() -> PackedFloat32Array:
	var s := samples_for(1.3)
	for f in [311.0, 329.6, 466.2, 622.3]:
		for i in s.size():
			var t := float(i) / SR
			var saw := fposmod(f * t, 1.0) * 2.0 - 1.0
			s[i] += saw * minf(t / 0.02, 1.0) * exp(-t * 3.5) * 0.12
	return s


func gen_pickup() -> PackedFloat32Array:
	var s := samples_for(0.3)
	for k in 2:
		var f := 660.0 if k == 0 else 990.0
		var start := int(k * 0.09 * SR)
		for i in range(start, s.size()):
			var t := float(i - start) / SR
			s[i] += (1.0 if sin(TAU * f * t) > 0 else -1.0) * exp(-t * 25.0) * 0.15
	return s


# Door latch / lock clunk
func gen_clunk() -> PackedFloat32Array:
	var s := samples_for(0.15)
	var lp := 0.0
	for i in s.size():
		var t := float(i) / SR
		var n := randf_range(-1, 1)
		lp += (n - lp) * 0.3
		s[i] = (n - lp) * exp(-t * 40.0) * 0.6 + sin(TAU * 180.0 * t) * exp(-t * 50.0) * 0.4
	return s


func gen_death() -> PackedFloat32Array:
	var s := samples_for(0.9)
	var ph := 0.0
	for i in s.size():
		var t := float(i) / SR
		ph += 300.0 * pow(50.0 / 300.0, t / 0.8) / SR
		s[i] = (fposmod(ph, 1.0) * 2.0 - 1.0) * exp(-t * 4.0) * 0.35
	return s


func gen_owl() -> PackedFloat32Array:
	var s := samples_for(0.9)
	for k in 2:
		var start := int(k * 0.45 * SR)
		var ph := 0.0
		for i in range(start, mini(s.size(), start + int(0.4 * SR))):
			var t := float(i - start) / SR
			ph += TAU * lerpf(400.0 if k == 0 else 360.0, 340.0 if k == 0 else 300.0, t / 0.4) / SR
			s[i] += sin(ph) * minf(t / 0.06, 1.0) * exp(-t * 8.0) * 0.25
	return s


# Detuned bell that rings out
func gen_bell() -> PackedFloat32Array:
	var s := samples_for(3.0)
	var base: float = [523.0, 622.0, 740.0, 831.0][randi() % 4]
	for i in s.size():
		var t := float(i) / SR
		var env := exp(-t * 1.6)
		s[i] = (sin(TAU * base * t) + sin(TAU * base * 1.007 * t) + 0.3 * sin(TAU * base * 2.76 * t)) * env * 0.08
	return s


# Breathy whisper: high-passed noise that swells and fades
func gen_whisper() -> PackedFloat32Array:
	var s := samples_for(1.0)
	var lp := 0.0
	for i in s.size():
		var t := float(i) / SR
		var n := randf_range(-1, 1)
		lp += (n - lp) * 0.35
		s[i] = (n - lp) * sin(PI * t) * (0.6 + 0.4 * sin(TAU * 7.0 * t)) * 0.25
	return s


# Metal creak of the van body
func gen_creak() -> PackedFloat32Array:
	var s := samples_for(0.8)
	var ph := 0.0
	var lp := 0.0
	for i in s.size():
		var t := float(i) / SR
		ph += (lerpf(160.0, 95.0, t / 0.8) + sin(TAU * 23.0 * t) * 12.0) / SR
		var saw := fposmod(ph, 1.0) * 2.0 - 1.0
		lp += (saw - lp) * 0.2
		s[i] = (saw - lp) * minf(t / 0.1, 1.0) * exp(-t * 4.0) * 0.4
	return s


# Looping background: detuned drone + wind. All frequencies fit a 4 s loop exactly, so it loops smoothly.
func gen_ambience(drone_freqs: Array, drone_vol: float, wind_vol: float) -> PackedFloat32Array:
	var s := samples_for(4.0)
	var lp := 0.0
	var wind_lp := 0.0
	for i in s.size():
		var t := float(i) / SR
		var d := 0.0
		for k in drone_freqs.size():
			var f: float = drone_freqs[k]
			d += (sin(TAU * f * t) if k == 2 else fposmod(f * t, 1.0) * 2.0 - 1.0)
		lp += (d - lp) * 0.09 # muffled, dark tone
		wind_lp += (randf_range(-1, 1) - wind_lp) * 0.06
		var gust := 0.6 + 0.4 * sin(TAU * 0.25 * t)
		s[i] = lp * drone_vol + wind_lp * wind_vol * gust * 3.0
	return s


# Dissonant chord with a nervous tremolo, for when the Keys Keeper is close
func gen_dread() -> PackedFloat32Array:
	var s := samples_for(4.0)
	for i in s.size():
		var t := float(i) / SR
		var trem := 0.7 + 0.3 * sin(TAU * 7.0 * t)
		var v := 0.0
		for f in [196.0, 207.75, 277.25, 415.5]:
			v += absf(fposmod(f * t, 1.0) * 4.0 - 2.0) - 1.0 # triangle wave
		s[i] = v * trem * 0.12
	return s


func build_sounds() -> void:
	sounds = {
		"footstep": make_wav(gen_footstep()),
		"jangle": make_wav(gen_jangle()),
		"heartbeat": make_wav(gen_heartbeat()),
		"sting": make_wav(gen_sting()),
		"pickup": make_wav(gen_pickup()),
		"clunk": make_wav(gen_clunk()),
		"death": make_wav(gen_death()),
		"owl": make_wav(gen_owl()),
		"bell": make_wav(gen_bell()),
		"whisper": make_wav(gen_whisper()),
		"creak": make_wav(gen_creak()),
		"amb1": make_wav(gen_ambience([55.0, 55.25, 58.25], 0.35, 0.5), true), # forest
		"amb2": make_wav(gen_ambience([49.0, 49.25, 51.75], 0.6, 0.35), true), # resting of the unstable
		"amb3": make_wav(gen_ambience([44.0, 44.25, 46.5], 0.55, 0.12), true), # van
		"dread": make_wav(gen_dread(), true),
	}
	for i in 10:
		var p := AudioStreamPlayer.new()
		add_child(p)
		sfx_players.append(p)
	add_child(ambience_player)
	add_child(dread_player)
	dread_player.stream = sounds["dread"]
	dread_player.volume_db = -80.0
	dread_player.play()


func play_sound(sound_name: String, volume := 1.0) -> void:
	if volume <= 0.01 or not sounds.has(sound_name):
		return
	var p: AudioStreamPlayer = sfx_players[next_player]
	next_player = (next_player + 1) % sfx_players.size()
	p.stream = sounds[sound_name]
	p.volume_db = linear_to_db(volume)
	p.play()


const SPOOKY := {1: ["owl", "owl", "whisper"], 2: ["bell", "whisper", "whisper", "bell"], 3: ["creak", "creak", "whisper"]}


# Called every frame. dread (0..1) = how close the Keys Keeper is.
func update_audio(mood: int, dread: float, delta: float) -> void:
	if mood != current_mood:
		current_mood = mood
		ambience_player.stream = sounds["amb%d" % mood]
		ambience_player.volume_db = -6.0
		ambience_player.play()

	dread_player.volume_db = linear_to_db(maxf(0.0001, dread * dread * 0.8))

	# Heartbeat speeds up as he gets closer
	if dread > 0.15:
		heartbeat_timer -= delta
		if heartbeat_timer <= 0:
			play_sound("heartbeat", 0.4 + dread * 0.6)
			heartbeat_timer = 1.0 - dread * 0.55
	else:
		heartbeat_timer = 0.0

	# Random spooky sounds (not while he's close)
	if dread == 0.0 and status != "title":
		spooky_timer -= delta
		if spooky_timer <= 0:
			var choices: Array = SPOOKY[mood]
			play_sound(choices[randi() % choices.size()], 0.8)
			spooky_timer = randf_range(5.0, 14.0)
