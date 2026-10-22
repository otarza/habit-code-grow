extends Node2D

# EAP — Evaporate All Parasites (Godot 4 version)
# The whole game in one script: attach it to a Node2D and press Play. No other files needed.
#
# Story:
#   Before playing, pick one of 3 save files. The game saves every time Grave gets in the van.
#   1. THE SCARY FOREST: 50 wolves and 50 bears, then the boss DESTRUCTION MAKER. Then the van.
#   2. THE RESTING OF THE UNSTABLE: 100 UNSTABLE, then the boss THE UNSTABLE CORE. Walk into the van.
#   3. Inside the van, walk up to the map on the wall and choose where to go:
#        THE DARK CAVE: 200 spiders, boss THE BROODMOTHER. Clearing it unlocks
#        THE CREEPY WAREHOUSE: 300 witches + 300 skeletons, boss THE GRAND WITCH. Clearing it unlocks
#        THE BEACH OF DOOM: 300 infected crabs + 300 land sharks + 300 infected octopuses, boss THE INFECTED KRAKEN.
#   4. After the beach, THE KEYS KEEPER locks Grave in the van. Hide from his footsteps, find 3 keys, unlock the back door.
# Every time Grave gets in the van it's a checkpoint: health and battery refill, and the game is saved.
#
# Controls:
#   A / D or arrows ........ move
#   W / Space / Up ......... jump
#   Right-click (or left-click, or F) ... shoot, hold to charge
#   E ...................... hide in drawer / open door / pick up key (inside the van)
#   S / Down ............... climb out / close door (inside the van)
#   1 / 2 / 3 .............. pick a save file, or a place on the van's map
#   R ...................... try again after dying
#   Esc .................... back to the save files
#   M ...................... sound on / off

# Every monster count is multiplied by this. Set it to 0.1 to test quickly; 1.0 is the real game.
const QUOTA_SCALE := 1.0

# Shown on the save screen so you can tell which copy of the script is running
const VERSION := "v1.0 - CHAPTER 1"

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

# Thrown attacks (lava, ink, webs, orbs)
const GOBLIN_SCALE := 1.8
const LAVA_GRAVITY := 900.0
const LAVA_FLIGHT_TIME := 1.0

# Van
const VAN_X := 2640.0 # where it waits at the end of the forest
const VAN_W := 200.0
const VAN_PARK_X := 40.0 # where it parks after arriving somewhere new

# Monsters
const MAX_ALIVE := 8 # regular monsters on screen at once
const MAX_MINIONS := 6 # monsters a boss can have summoned at once
const SPAWN_INTERVAL := 0.7
const EMERGE_TIME := 0.9

# Story timing
const DRIVE_TIME := 2.0
const TITLE_TIME := 4.5
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
const MAP_X := 190.0 # the map on the van wall
const MAP_W := 250.0

const SAVE_PATH := "user://eap_saves.cfg"

const ACCENT := Color("#35e0a1")
const BEAM_COLOR := Color("#ffe24a")
const LAVA_COLOR := Color("#ff6a1a")
const HP_COLOR := Color("#e74c3c")
const BATTERY_COLOR := Color("#4ab8ff")
const UNSTABLE_COLOR := Color("#b45cff")
const INFECTED := Color("#8cff5a")
const KEEPER_EYES := Color("#8cff5a") # the Keys Keeper is infected too
const KEY_COLORS := {"blue": Color("#3d8bff"), "green": Color("#35e05a"), "red": Color("#ff3030")}

# Monster stats. pitch = how high their hurt/death sounds are.
const ENEMY := {
	"wolf": {"plural": "wolves", "short": "WOLVES", "hp": 16, "dmg": 10, "speed": 170, "w": 60, "h": 44, "color": Color("#5d6370"), "pitch": 1.25},
	"bear": {"plural": "bears", "short": "BEARS", "hp": 40, "dmg": 20, "speed": 70, "w": 70, "h": 66, "color": Color("#5a3a22"), "pitch": 0.6},
	"unstable": {"plural": "unstable", "short": "UNSTABLE", "hp": 16, "dmg": 5, "speed": 90, "w": 40, "h": 40, "color": UNSTABLE_COLOR, "pitch": 1.0},
	"spider": {"plural": "spiders", "short": "SPIDERS", "hp": 8, "dmg": 5, "speed": 140, "w": 34, "h": 22, "color": Color("#2a2030"), "pitch": 1.7},
	"witch": {"plural": "witches", "short": "WITCHES", "hp": 16, "dmg": 8, "speed": 110, "w": 44, "h": 70, "color": Color("#79c25a"), "pitch": 1.4, "fly": true},
	"skeleton": {"plural": "skeletons", "short": "SKELETONS", "hp": 16, "dmg": 10, "speed": 80, "w": 30, "h": 72, "color": Color("#e8e2cf"), "pitch": 1.1},
	"crab": {"plural": "infected crabs", "short": "CRABS", "hp": 12, "dmg": 8, "speed": 120, "w": 46, "h": 32, "color": Color("#c9452c"), "pitch": 1.5},
	"shark": {"plural": "land sharks", "short": "SHARKS", "hp": 20, "dmg": 12, "speed": 160, "w": 90, "h": 40, "color": Color("#5d6b78"), "pitch": 0.8, "fly": true},
	"octopus": {"plural": "infected octopuses", "short": "OCTOPUSES", "hp": 16, "dmg": 8, "speed": 70, "w": 44, "h": 50, "color": Color("#6b3a8a"), "pitch": 1.0},
}

# The boss at the end of every place
const BOSSES := {
	"destruction_maker": {"name": "DESTRUCTION MAKER", "hp": 600, "w": 50, "h": 72, "contact": 0, "color": Color("#d4372b")},
	"unstable_core": {"name": "THE UNSTABLE CORE", "hp": 500, "w": 120, "h": 110, "contact": 15, "color": UNSTABLE_COLOR},
	"broodmother": {"name": "THE BROODMOTHER", "hp": 700, "w": 150, "h": 95, "contact": 18, "color": Color("#c0262a")},
	"grand_witch": {"name": "THE GRAND WITCH", "hp": 800, "w": 70, "h": 130, "contact": 12, "color": Color("#79c25a")},
	"kraken": {"name": "THE INFECTED KRAKEN", "hp": 1000, "w": 130, "h": 150, "contact": 20, "color": INFECTED},
}

const PLACES := {
	"forest": {
		"name": "THE SCARY FOREST", "line": "The parasite virus got into the wolves and bears...", "color": Color("#ff6a5a"),
		"quota": {"wolf": 50, "bear": 50}, "boss": "destruction_maker",
	},
	"resting": {
		"name": "THE RESTING OF THE UNSTABLE", "line": "Something is moving under the ground...", "color": Color("#cfa8ff"),
		"quota": {"unstable": 100}, "boss": "unstable_core",
	},
	"cave": {
		"name": "THE DARK CAVE", "line": "Thousands of infected little legs in the dark...", "color": Color("#3ff2d6"),
		"quota": {"spider": 200}, "boss": "broodmother",
	},
	"warehouse": {
		"name": "THE CREEPY WAREHOUSE", "line": "Infected witches above. Infected skeletons below.", "color": Color("#ffcf5a"),
		"quota": {"witch": 300, "skeleton": 300}, "boss": "grand_witch",
	},
	"beach": {
		"name": "THE BEACH OF DOOM", "line": "The tide washed up something infected...", "color": INFECTED,
		"quota": {"crab": 300, "shark": 300, "octopus": 300}, "boss": "kraken",
	},
}
const MAP_ORDER := ["cave", "warehouse", "beach"]

const SHOT_STYLE := {
	"lava": {"color": LAVA_COLOR, "r": 18, "dmg": 20},
	"orb": {"color": UNSTABLE_COLOR, "r": 16, "dmg": 15},
	"web": {"color": Color("#e8e8f0"), "r": 14, "dmg": 12},
	"ink": {"color": Color("#3f8a2a"), "r": 15, "dmg": 14}, # infected green ink
	"magic": {"color": Color("#7dff6a"), "r": 9, "dmg": 10},
	"soundwave": {"color": INFECTED, "r": 16, "dmg": 8}, # witch cackles
	"bone": {"color": INFECTED, "r": 10, "dmg": 8}, # skeletons' green flying bones
	"venom": {"color": INFECTED, "r": 8, "dmg": 5}, # spider spit
	"bubble": {"color": Color("#b8ff9a"), "r": 11, "dmg": 6}, # crab bubbles
	"howl": {"color": INFECTED, "r": 13, "dmg": 6}, # wolf howl-waves
	"slime": {"color": Color("#6be04a"), "r": 15, "dmg": 10}, # bear slime
}


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


class Enemy:
	var kind := ""
	var x := 0.0
	var y := 450.0 # feet position (flyers: bottom of the body)
	var vy := 0.0
	var w := 40.0
	var h := 40.0
	var hp := 10.0
	var max_hp := 10.0
	var damage := 5.0
	var speed := 100.0
	var flying := false
	var state := "active" # emerging (out of the ground), dropping (on a thread), active
	var t := 0.0
	var drop_from := 0.0
	var hop_cooldown := 1.0
	var attack_cooldown := 2.0
	var hurt_flash := 0.0
	var seed_offset := 0.0
	var facing := 1
	var minion := false # summoned by a boss: doesn't count toward the place's total
	var rage := 0.0 # > 0 while a bear charges
	var walk_time := 0.0


class Boss:
	var kind := ""
	var name := ""
	var x := 0.0
	var y := 450.0
	var vx := 0.0
	var vy := 0.0
	var w := 60.0
	var h := 80.0
	var hp := 100.0
	var max_hp := 100.0
	var contact := 15.0 # damage for touching it
	var facing := -1
	var t := 0.0
	var attack_cooldown := 2.0
	var summon_cooldown := 3.0
	var hop_cooldown := 1.5
	var throw_anim := 0.0
	var hurt_flash := 0.0
	var walk_time := 0.0


class Shot:
	var kind := ""
	var pos := Vector2.ZERO
	var vel := Vector2.ZERO
	var gravity := 0.0
	var radius := 10.0
	var color := Color.WHITE
	var damage := 10.0
	var life := 0.0
	var dead := false


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

var scene := "forest" # forest, resting, cave, warehouse, beach, hub (inside the van), keeper
var status := "menu" # menu, playing, driving, title, arriving, won, lost
var phase_time := 0.0
var next_scene := "forest" # where the title card leads
var death_reason := ""

var grave := Hero.new()
var beams: Array = []
var enemies: Array = []
var boss: Boss = null
var shots: Array = []
var particles: Array = []
var texts: Array = []
var place_phase := "fight" # fight (monsters), boss, cleared
var kills := {}
var spawned := {}
var spawn_timer := 1.0
var boss_banner := 0.0
var cam_x := 0.0
var hint := ""
var hint_time := 0.0

# Save files
var slots: Array = [{}, {}, {}]
var slot := 0
var progress := {"checkpoint": "forest", "cleared": []}
var menu_index := 0
var erase_armed := -1
var last_mouse := Vector2.ZERO

# The map on the van wall
var map_open := false
var map_choice := ""
var map_index := -1

# Input
var aim := Vector2.ZERO # mouse position in the world
var jump_pressed := false
var action_pressed := false
var down_pressed := false
var fire_block := false # ignore the click that picked a menu item until it's released
var status_time := 0.0 # seconds since the status last changed (for text that types itself out)
var last_status := ""
var last_typed := 0
var game_over_sound := false
var sound_next := {} # earliest time each limited sound may play again

# Inside the van (the Keys Keeper)
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
	status = "loading" # the loading screen makes the sounds, then opens the save files


# ---------- save files ----------

func load_slots() -> void:
	var cfg := ConfigFile.new()
	cfg.load(SAVE_PATH) # a missing file just means there are no saves yet
	for i in 3:
		var section := "slot%d" % (i + 1)
		if cfg.has_section(section):
			slots[i] = {
				"checkpoint": str(cfg.get_value(section, "checkpoint", "forest")),
				"cleared": Array(cfg.get_value(section, "cleared", [])),
			}
		else:
			slots[i] = {}


func save_progress() -> void:
	var cfg := ConfigFile.new()
	cfg.load(SAVE_PATH)
	var section := "slot%d" % (slot + 1)
	cfg.set_value(section, "checkpoint", progress["checkpoint"])
	cfg.set_value(section, "cleared", progress["cleared"])
	cfg.save(SAVE_PATH)
	slots[slot] = progress.duplicate(true)


func erase_slot(i: int) -> void:
	var cfg := ConfigFile.new()
	cfg.load(SAVE_PATH)
	var section := "slot%d" % (i + 1)
	if cfg.has_section(section):
		cfg.erase_section(section)
	cfg.save(SAVE_PATH)
	slots[i] = {}
	erase_armed = -1


# Erasing needs two presses, so a save can't be wiped by accident
func arm_or_erase(i: int) -> void:
	var saved: Dictionary = slots[i]
	if saved.is_empty():
		return
	if erase_armed == i:
		erase_slot(i)
	else:
		erase_armed = i


func start_slot(i: int) -> void:
	play_sound("select", 0.7)
	slot = i
	erase_armed = -1
	fire_block = true
	var saved: Dictionary = slots[i]
	if saved.is_empty():
		progress = {"checkpoint": "forest", "cleared": []}
		save_progress()
	else:
		progress = saved.duplicate(true)
	var cp: String = progress["checkpoint"]
	show_title("hub" if cp == "done" else cp)


func go_to_menu() -> void:
	load_slots()
	status = "menu"
	menu_index = slot
	erase_armed = -1


func is_cleared(place: String) -> bool:
	var cleared: Array = progress["cleared"]
	return cleared.has(place)


# The map's places unlock one after another
func is_unlocked(place: String) -> bool:
	match place:
		"warehouse":
			return is_cleared("cave")
		"beach":
			return is_cleared("warehouse")
	return true


func scene_name(s: String) -> String:
	if PLACES.has(s):
		return PLACES[s]["name"]
	match s:
		"hub":
			return "THE EAP VAN"
		"keeper":
			return "THE KEYS KEEPER"
		"done":
			return "COMPLETED"
	return s


# ---------- moving between places ----------

func reset_scene(s: String) -> void:
	scene = s
	status = "playing"
	phase_time = 0.0
	death_reason = ""
	grave = Hero.new() # full health and battery
	beams.clear()
	enemies.clear()
	shots.clear()
	particles.clear()
	texts.clear()
	boss = null
	place_phase = "fight"
	kills = {}
	spawned = {}
	if PLACES.has(s):
		for k in PLACES[s]["quota"]:
			kills[k] = 0
			spawned[k] = 0
	spawn_timer = 1.0
	boss_banner = 0.0
	cam_x = 0.0
	hint_time = 0.0
	map_open = false
	map_choice = ""
	reset_van_room()


# Start a scene: the van drops Grave off, or he's inside it
func start_scene(s: String) -> void:
	reset_scene(s)
	match s:
		"forest":
			grave.x = 200.0
			show_hint(place_goal("forest"), 5.0)
		"hub":
			grave.x = 640.0
			show_hint("Walk up to the map on the wall to choose where to go.", 4.0)
		"keeper":
			grave.x = 448.0 # locked inside the van, beside the back door
		_:
			status = "arriving"
			grave.x = VAN_PARK_X + VAN_W + 40.0


func show_title(next: String) -> void:
	status = "title"
	next_scene = next
	phase_time = 0.0


# Got in the van: checkpoint (refill and save), then on to the next scene
func board_van(next: String, drive := false) -> void:
	grave.hp = GRAVE_MAX_HP
	grave.battery = BATTERY_MAX
	shots.clear()
	beams.clear()
	progress["checkpoint"] = next
	save_progress()
	if drive:
		status = "driving"
		next_scene = next
		phase_time = 0.0
	else:
		show_title(next)


# Where the van goes after a place is cleared
func leave_place() -> void:
	match scene:
		"forest":
			board_van("resting", true)
		"beach":
			board_van("keeper")
		_:
			board_van("hub")


func restart() -> void:
	fire_block = true
	if status == "won":
		go_to_menu()
	else:
		start_scene(scene)


func show_hint(text_to_show: String, time := 0.5) -> void:
	if hint != text_to_show or hint_time < time:
		hint = text_to_show
		hint_time = time


func is_over() -> bool:
	return status == "won" or status == "lost"


# ---------- input ----------

func _input(event: InputEvent) -> void:
	if status == "loading":
		return
	if event is InputEventKey and event.pressed and not event.echo:
		var k: Key = event.keycode
		if k == KEY_M:
			AudioServer.set_bus_mute(0, not AudioServer.is_bus_mute(0))
			return
		if status == "menu":
			menu_key(k)
			return
		match k:
			KEY_W, KEY_UP, KEY_SPACE:
				jump_pressed = true
			KEY_E:
				action_pressed = true
			KEY_S, KEY_DOWN:
				down_pressed = true
			KEY_1, KEY_2, KEY_3:
				if scene == "hub" and map_open:
					map_choice = MAP_ORDER[k - KEY_1]
			KEY_R:
				if is_over():
					restart()
			KEY_ESCAPE:
				go_to_menu()
	if event is InputEventMouseButton and event.pressed:
		var m := get_local_mouse_position()
		if status == "menu":
			if event.button_index == MOUSE_BUTTON_LEFT:
				menu_click(m)
		elif is_over():
			restart()
		elif scene == "hub" and map_open and status == "playing":
			for i in 3:
				if map_card_rect(i).has_point(m):
					map_choice = MAP_ORDER[i]
					fire_block = true


func menu_key(k: Key) -> void:
	match k:
		KEY_W, KEY_UP:
			menu_index = (menu_index + 2) % 3
			play_sound("blip", 0.5)
			erase_armed = -1
		KEY_S, KEY_DOWN:
			menu_index = (menu_index + 1) % 3
			play_sound("blip", 0.5)
			erase_armed = -1
		KEY_1, KEY_2, KEY_3:
			start_slot(k - KEY_1)
		KEY_E, KEY_ENTER, KEY_KP_ENTER, KEY_SPACE:
			start_slot(menu_index)
		KEY_X, KEY_DELETE, KEY_BACKSPACE:
			arm_or_erase(menu_index)


func menu_click(m: Vector2) -> void:
	for i in 3:
		var saved: Dictionary = slots[i]
		if not saved.is_empty() and erase_rect(i).has_point(m):
			arm_or_erase(i)
			return
		if slot_rect(i).has_point(m):
			start_slot(i)
			return


func slot_rect(i: int) -> Rect2:
	return Rect2(VIEW_W / 2 - 300, 170 + i * 105, 600, 88)


func erase_rect(i: int) -> Rect2:
	return Rect2(VIEW_W / 2 + 300 - 112, 170 + i * 105 + 27, 96, 34)


func map_card_rect(i: int) -> Rect2:
	return Rect2(VIEW_W / 2 - 375 + i * 252, 150, 234, 250)


func key(a: Key, b: Key) -> bool:
	return Input.is_key_pressed(a) or Input.is_key_pressed(b)


func fire_held() -> bool:
	var held := Input.is_mouse_button_pressed(MOUSE_BUTTON_RIGHT) \
		or Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT) \
		or Input.is_key_pressed(KEY_F)
	if fire_block:
		if not held:
			fire_block = false
		return false
	return held


# ---------- main loop ----------

func _process(delta: float) -> void:
	delta = minf(delta, 1.0 / 30.0)
	phase_time += delta
	aim = get_local_mouse_position() + Vector2(cam_x, 0)
	hint_time = maxf(0.0, hint_time - delta)
	boss_banner = maxf(0.0, boss_banner - delta)

	# Story screens type their text out with little blips
	if status != last_status:
		last_status = status
		status_time = 0.0
		last_typed = 0
	status_time += delta
	if status in ["title", "lost", "won"]:
		var typed := typed_letters(0.3 if status == "title" else (0.9 if status == "lost" else 0.6))
		if typed > last_typed and last_typed < current_dialog().length():
			last_typed = typed
			if typed % 2 == 0:
				play_sound("blip", 0.35)
	if status == "lost" and not game_over_sound and status_time > 0.6:
		game_over_sound = true
		play_sound("heart_break", 0.8)
	elif status != "lost":
		game_over_sound = false

	if status == "loading":
		load_some_sounds()
		queue_redraw()
		return

	if status == "menu":
		# Hovering a save file selects it
		var m := get_local_mouse_position()
		if m != last_mouse:
			last_mouse = m
			for i in 3:
				if slot_rect(i).has_point(m):
					menu_index = i
		update_audio("menu", 0.0, delta)
		update_charge_hum(0.0)
		queue_redraw()
		return

	# Spooky background sound for the current place; dread rises as the Keys Keeper gets close
	var mood_scene := next_scene if status == "title" else scene
	var dread := footstep_volume() if (scene == "keeper" and status == "playing") else 0.0
	update_audio(mood_scene, dread, delta)
	var charging := status == "playing" and PLACES.has(scene) and grave.charging
	update_charge_hum(grave.charge / MAX_CHARGE if charging else 0.0)

	if status == "driving" and phase_time > DRIVE_TIME:
		show_title(next_scene)
	elif status == "title" and phase_time > TITLE_TIME:
		start_scene(next_scene)
	elif status == "arriving" and phase_time > ARRIVE_TIME:
		status = "playing"
		phase_time = 0.0
		show_hint(place_goal(scene), 5.0)

	if status == "playing":
		match scene:
			"keeper":
				update_van_room(delta)
				if status == "won" and progress["checkpoint"] != "done":
					progress["checkpoint"] = "done"
					save_progress()
			"hub":
				update_hub(delta)
			_:
				update_grave(delta)
				for b: Beam in beams:
					b.pos += b.vel * delta
					b.life -= delta
				update_place(delta)
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

	if PLACES.has(scene):
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
	# Zap: quick shots are bright, charged shots deeper and louder
	play_sound("shoot%d" % roundi(power * 2.0), 0.9 + power * 0.3)


func hurt_grave(damage: float, color: Color) -> void:
	grave.hp = maxf(0.0, grave.hp - damage)
	grave.invuln = HIT_INVULN
	float_text(Vector2(grave.x, grave.y - grave.h - 34), "-%d" % int(damage), color)
	play_sound("grave_hurt")
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


# ---------- places: monsters, bosses and the van ----------

func quota_of(place: String, kind: String) -> int:
	var quota: Dictionary = PLACES[place]["quota"]
	return maxi(1, roundi(float(quota[kind]) * QUOTA_SCALE))


func place_goal(place: String) -> String:
	if not PLACES.has(place):
		return ""
	var parts := PackedStringArray()
	for k in PLACES[place]["quota"]:
		parts.append("%d %s" % [quota_of(place, k), ENEMY[k]["plural"]])
	return "Evaporate " + " and ".join(parts) + ", then beat the boss!"


# The van is at the end of the forest; everywhere else it's parked where it dropped Grave off
func min_x() -> float:
	return 60.0 if scene == "forest" else VAN_PARK_X + VAN_W + 20.0


func max_x() -> float:
	return VAN_X - 40.0 if scene == "forest" else WORLD_W - 40.0


func grave_chest() -> Vector2:
	return Vector2(grave.x, grave.y - grave.h * 0.55)


func count_regular() -> int:
	var n := 0
	for e: Enemy in enemies:
		if not e.minion:
			n += 1
	return n


func quota_done() -> bool:
	for k in kills:
		if int(kills[k]) < quota_of(scene, k):
			return false
	return true


# Pick which monster to send next, weighted by how many of each are still to come
func pick_kind() -> String:
	var weights := {}
	var total := 0
	for k in kills:
		var left: int = quota_of(scene, k) - int(spawned[k])
		if left > 0:
			weights[k] = left
			total += left
	if total == 0:
		return ""
	var r := randi() % total
	for k in weights:
		r -= int(weights[k])
		if r < 0:
			return k
	return ""


func update_place(delta: float) -> void:
	var place: Dictionary = PLACES[scene]

	# Monsters keep coming until the place's total has been sent, then the boss
	if place_phase == "fight":
		spawn_timer -= delta
		if spawn_timer <= 0 and count_regular() < MAX_ALIVE:
			var kind := pick_kind()
			if kind != "":
				spawn_enemy(kind, false)
				spawned[kind] = int(spawned[kind]) + 1
			spawn_timer = SPAWN_INTERVAL * randf_range(0.6, 1.4)
		if quota_done() and count_regular() == 0:
			start_boss(place["boss"])

	for e: Enemy in enemies:
		if update_enemy(e, delta):
			hurt_grave(e.damage, HP_COLOR)
	if boss != null:
		update_boss(delta)
	update_shots(delta)
	beam_hits()

	for e: Enemy in enemies:
		if e.hp <= 0:
			enemy_death(e)
	enemies = enemies.filter(func(e: Enemy) -> bool: return e.hp > 0)
	if boss != null and boss.hp <= 0:
		boss_death()

	# Back to the van
	if status != "playing":
		return
	var at_van := grave.x > VAN_X if scene == "forest" else grave.x < VAN_PARK_X + VAN_W + 10
	if place_phase == "cleared":
		if at_van:
			leave_place()
		else:
			show_hint("%s is clear! Get back to the van %s" % [place["name"], ">>" if scene == "forest" else "<<"])
	elif at_van:
		show_hint("The van won't start until this place is clear!")


func make_enemy(kind: String, minion: bool) -> Enemy:
	var stats: Dictionary = ENEMY[kind]
	var e := Enemy.new()
	e.kind = kind
	e.hp = float(stats["hp"])
	e.max_hp = e.hp
	e.damage = float(stats["dmg"])
	e.speed = float(stats["speed"])
	e.w = float(stats["w"])
	e.h = float(stats["h"])
	e.flying = stats.get("fly", false)
	e.minion = minion
	e.seed_offset = randf() * 1000.0
	e.hop_cooldown = randf_range(0.6, 1.6)
	e.attack_cooldown = randf_range(0.6, 1.6)
	match kind:
		"unstable", "skeleton":
			e.state = "emerging" # out of the ground
		"spider":
			e.state = "dropping" # down from the cave ceiling
			e.drop_from = 40.0
			e.y = 40.0
		"witch":
			e.y = FLOOR_Y - 160.0
		"shark":
			e.y = FLOOR_Y - 90.0
	return e


# near_x >= 0: a boss summons it right next to itself
func spawn_enemy(kind: String, minion: bool, near_x := -1.0) -> void:
	var e := make_enemy(kind, minion)
	var side := -1.0 if randf() < 0.5 else 1.0
	var center := grave.x if near_x < 0 else near_x
	var dist := randf_range(220, 480)
	match kind:
		"witch", "shark", "wolf", "bear", "crab", "octopus":
			dist = randf_range(480, 560) # they come in from the edge of the screen
		"spider":
			dist = randf_range(120, 420)
	if near_x >= 0:
		dist = randf_range(40, 160)
	var x := center + side * dist
	if x < min_x() or x > max_x():
		x = center - side * dist
	e.x = clampf(x, min_x(), max_x())
	enemies.append(e)
	if e.state == "emerging":
		burst(Vector2(e.x, FLOOR_Y), 12, Color("#5a4a6a"), 160.0, 4.0)
	match kind:
		"unstable":
			play_sound("unstable_emerge")
		"skeleton":
			play_sound("unstable_emerge", 0.8, 1.4)
		"wolf":
			play_limited("howl", 1.6, 0.7, randf_range(0.9, 1.1)) # every infected wolf howls as it arrives
		"bear":
			play_limited("growl", 0.8, 0.8, randf_range(0.85, 1.1))
		"witch":
			play_limited("cackle", 0.4, 0.7, randf_range(0.9, 1.15))
		"shark":
			play_sound("lava_throw", 0.7, 0.6)
		"crab", "octopus":
			play_sound("lava_splat", 0.35, 1.6)


func enemy_hittable(e: Enemy) -> bool:
	return e.state != "emerging" or e.t > EMERGE_TIME * 0.5


# Returns true if it bit Grave this frame
func update_enemy(e: Enemy, delta: float) -> bool:
	e.t += delta
	e.hurt_flash = maxf(0.0, e.hurt_flash - delta)
	if e.state == "emerging":
		if e.t >= EMERGE_TIME:
			e.state = "active"
			e.t = 0.0
		return false
	if e.state == "dropping":
		e.y = lerpf(e.drop_from, FLOOR_Y, minf(1.0, e.t / 0.9))
		if e.t >= 0.9:
			e.state = "active"
			e.y = FLOOR_Y
		return false

	var dx := grave.x - e.x
	var dir := 1.0 if dx >= 0 else -1.0
	e.facing = 1 if dx >= 0 else -1
	e.walk_time += delta
	e.rage = maxf(0.0, e.rage - delta)
	e.attack_cooldown -= delta
	var move := dir
	var speed := e.speed
	var mouth := Vector2(e.x + 14 * e.facing, e.y - e.h * 0.75)
	match e.kind:
		"unstable":
			move = dir + sin(e.t * 9.0 + e.seed_offset) * 0.6 # jittery
		"spider":
			move = dir + sin(e.t * 9.0 + e.seed_offset) * 0.6
			# Spits infected green venom
			if e.attack_cooldown <= 0 and absf(dx) < 360:
				lob(Vector2(e.x + 8 * e.facing, e.y - 12), grave.x + randf_range(-30, 30), "venom")
				e.attack_cooldown = randf_range(3.0, 5.0)
		"wolf":
			# Howls, then lunges
			if e.attack_cooldown <= 0 and absf(dx) < 420:
				play_limited("howl", 1.6, 0.6, randf_range(0.9, 1.15))
				# The infected howl flies at Grave as a green wave
				shoot_at(mouth, grave_chest(), 280.0, "howl")
				e.attack_cooldown = randf_range(4.0, 7.0)
		"bear":
			# Growls, then charges
			if e.attack_cooldown <= 0 and absf(dx) < 320:
				play_limited("growl", 0.8, 0.9, randf_range(0.85, 1.1))
				# Spits a glob of infected slime, then charges
				lob(mouth, grave.x + randf_range(-30, 30), "slime")
				burst(mouth, 10, INFECTED, 140.0, 3.0)
				e.rage = 1.0
				e.attack_cooldown = randf_range(4.0, 6.0)
			if e.rage > 0:
				speed *= 2.6
				if randf() < 0.5: # green parasite trail while charging
					burst(Vector2(e.x, e.y - 10), 1, INFECTED, 40.0, 4.0)
		"crab":
			move = dir + sin(e.t * 6.0 + e.seed_offset) * 0.9 # sideways scuttle
			# Blows infected bubbles
			if e.attack_cooldown <= 0 and absf(dx) < 420:
				shoot_at(Vector2(e.x + 20 * e.facing, e.y - 22), grave_chest(), 170.0, "bubble")
				e.attack_cooldown = randf_range(3.0, 4.5)
		"witch":
			# Hovers at a distance; her cackle throws soundwaves
			var hover_x := grave.x - dir * 240.0
			move = clampf((hover_x - e.x) / 60.0, -1.0, 1.0)
			e.y = FLOOR_Y - 160.0 + sin(e.t * 2.0 + e.seed_offset) * 22.0
			if e.attack_cooldown <= 0 and absf(dx) < 600:
				play_limited("cackle", 0.4, 0.75, randf_range(0.9, 1.15))
				shoot_at(Vector2(e.x + 12 * e.facing, e.y - 40), grave_chest(), 260.0, "soundwave")
				e.attack_cooldown = randf_range(2.4, 3.6)
		"skeleton":
			# Rattles its bones and throws green flying bones
			if e.attack_cooldown <= 0 and absf(dx) < 560:
				play_limited("bones", 0.3, 0.7, 1.2)
				lob(mouth, grave.x + randf_range(-40, 40), "bone")
				e.attack_cooldown = randf_range(2.5, 3.8)
		"shark":
			# No legs: it flies low, swooping up and down
			e.y = FLOOR_Y - 40.0 - (sin(e.t * 2.4 + e.seed_offset) * 0.5 + 0.5) * 100.0
		"octopus":
			# Throws infected green ink
			if e.attack_cooldown <= 0 and absf(dx) < 520:
				lob(Vector2(e.x, e.y - e.h), grave.x + randf_range(-40, 40), "ink")
				e.attack_cooldown = randf_range(2.6, 3.8)
	e.x = clampf(e.x + move * speed * delta, min_x(), max_x())

	if not e.flying:
		e.hop_cooldown -= delta
		if e.hop_cooldown <= 0 and e.y >= FLOOR_Y:
			match e.kind:
				"wolf":
					if absf(dx) < 200:
						e.vy = -520.0 # lunge
						e.hop_cooldown = 1.4
				"unstable", "spider":
					e.vy = -380.0 - randf() * 200.0
					e.hop_cooldown = randf_range(0.8, 2.2)
				_:
					e.hop_cooldown = 1.0
		e.vy += GRAVITY * delta
		e.y += e.vy * delta
		if e.y >= FLOOR_Y:
			e.y = FLOOR_Y
			e.vy = 0.0

	var touching := grave.invuln <= 0 \
		and absf(grave.x - e.x) < (grave.w + e.w) / 2 - 4 \
		and e.y > grave.y - grave.h and e.y - e.h < grave.y
	if touching:
		# Bounce back after biting so it can't stay stuck on Grave
		e.x = clampf(e.x - dir * (120.0 if e.flying else 70.0), min_x(), max_x())
		e.rage = 0.0
		if not e.flying:
			e.vy = -360.0
			e.hop_cooldown = 1.2
	return touching


func enemy_death(e: Enemy) -> void:
	var mid := Vector2(e.x, e.y - e.h / 2)
	steam(mid, 18)
	burst(mid, 14, ENEMY[e.kind]["color"], 200.0, 4.0)
	match e.kind:
		"unstable":
			play_sound("unstable_death")
		"skeleton":
			play_sound("bones")
		"witch":
			play_sound("cackle", 0.8, 1.3)
		_:
			play_sound("monster_death", 0.9, float(ENEMY[e.kind]["pitch"]) * randf_range(0.92, 1.08))
	if not e.minion and kills.has(e.kind):
		kills[e.kind] = int(kills[e.kind]) + 1


func enemy_hurt_sound(kind: String) -> void:
	if kind == "unstable":
		play_sound("unstable_hurt", 1.0, randf_range(0.85, 1.2))
	else:
		play_sound("monster_hurt", 0.8, float(ENEMY[kind]["pitch"]) * randf_range(0.9, 1.1))


# Evaporator beams against monsters, the boss, and anything thrown
func beam_hits() -> void:
	for b: Beam in beams:
		if b.life <= 0:
			continue
		for e: Enemy in enemies:
			if e.hp > 0 and enemy_hittable(e) and hits_box(b.pos, b.size / 2, e.x, e.y, e.w + 6, e.h + 6):
				b.life = 0
				e.hp = maxf(0.0, e.hp - b.damage)
				e.hurt_flash = 0.1
				steam(b.pos, 3 + roundi(b.size / 2))
				float_text(Vector2(e.x, e.y - e.h - 20), "-%d" % b.damage, BEAM_COLOR, 0.7)
				if e.hp > 0:
					enemy_hurt_sound(e.kind)
				break
		if b.life > 0 and boss != null and boss.hp > 0 and hits_box(b.pos, b.size / 2, boss.x, boss.y, boss.w + 8, boss.h + 8):
			b.life = 0
			boss.hp = maxf(0.0, boss.hp - b.damage)
			boss.hurt_flash = 0.12
			steam(b.pos, 4 + roundi(b.size))
			float_text(Vector2(boss.x, boss.y - boss.h - 30), "-%d" % b.damage, BEAM_COLOR)
			if boss.hp > 0:
				play_sound("goblin_hurt" if boss.kind == "destruction_maker" else "boss_hurt", 1.0, randf_range(0.9, 1.1))
		if b.life > 0:
			for s: Shot in shots:
				if not s.dead and s.pos.distance_to(b.pos) < s.radius + b.size / 2 + 4:
					s.dead = true
					steam(b.pos, 6)
					play_sound("lava_splat", 0.6)


# ---------- thrown attacks ----------

func make_shot(kind: String, from: Vector2) -> Shot:
	var style: Dictionary = SHOT_STYLE[kind]
	var s := Shot.new()
	s.kind = kind
	s.pos = from
	s.color = style["color"]
	s.radius = float(style["r"])
	s.damage = float(style["dmg"])
	return s


# Lob an arc that lands roughly at target_x
func lob(from: Vector2, target_x: float, kind: String) -> void:
	var t := LAVA_FLIGHT_TIME * randf_range(0.85, 1.15)
	var s := make_shot(kind, from)
	s.gravity = LAVA_GRAVITY
	s.vel = Vector2((target_x - from.x) / t, (FLOOR_Y - 30 - from.y - 0.5 * LAVA_GRAVITY * t * t) / t)
	shots.append(s)
	if kind != "bone": # skeletons already rattled
		play_limited("lava_throw", 0.15, 0.8, 1.0 if kind == "lava" else 0.75)


# Fire straight at a point (spells, soundwaves, bubbles)
func shoot_at(from: Vector2, target: Vector2, speed: float, kind: String, spread := 0.0) -> void:
	var s := make_shot(kind, from)
	s.vel = Vector2.from_angle((target - from).angle() + spread) * speed
	shots.append(s)
	match kind:
		"magic":
			play_limited("magic", 0.1, 0.6, randf_range(0.9, 1.1))
		"bubble":
			play_limited("lava_splat", 0.2, 0.35, 1.9)


func update_shots(delta: float) -> void:
	for s: Shot in shots:
		if s.dead:
			continue
		s.life += delta
		s.vel.y += s.gravity * delta
		s.pos += s.vel * delta
		if randf() < 0.5:
			var spark := Particle.new()
			spark.pos = s.pos
			spark.vel = Vector2(0, -20)
			spark.life = 0.3
			spark.max_life = 0.3
			spark.size = 5.0
			spark.color = s.color
			particles.append(spark)
		if grave.invuln <= 0 and hits_box(s.pos, s.radius, grave.x, grave.y, grave.w, grave.h):
			burst(s.pos, 14, s.color, 200.0, 3.0)
			s.dead = true
			play_sound("lava_splat")
			hurt_grave(s.damage, HP_COLOR)
		elif s.pos.y >= FLOOR_Y:
			burst(Vector2(s.pos.x, FLOOR_Y), 10, s.color, 160.0, 3.0)
			s.dead = true
			play_sound("lava_splat", 0.5)
		elif s.life > 5.0 or absf(s.pos.x - grave.x) > 900:
			s.dead = true
	shots = shots.filter(func(s: Shot) -> bool: return not s.dead)


# ---------- bosses ----------

func start_boss(kind: String) -> void:
	var stats: Dictionary = BOSSES[kind]
	var b := Boss.new()
	b.kind = kind
	b.name = stats["name"]
	b.hp = float(stats["hp"])
	b.max_hp = b.hp
	b.w = float(stats["w"])
	b.h = float(stats["h"])
	b.contact = float(stats["contact"])
	var side := 1.0 if grave.x < (min_x() + max_x()) / 2.0 else -1.0
	b.x = clampf(grave.x + side * 520.0, min_x() + 60.0, max_x() - 60.0)
	b.y = FLOOR_Y - 230.0 if kind == "grand_witch" else FLOOR_Y
	boss = b
	place_phase = "boss"
	boss_banner = 3.0
	play_sound("boss_roar")


func update_boss(delta: float) -> void:
	var b := boss
	b.t += delta
	b.hurt_flash = maxf(0.0, b.hurt_flash - delta)
	b.throw_anim = maxf(0.0, b.throw_anim - delta)
	b.attack_cooldown -= delta
	var dx := grave.x - b.x
	b.facing = 1 if dx >= 0 else -1
	var angry := b.hp < b.max_hp * 0.5 # attacks get faster at half health
	var rate := 0.7 if angry else 1.0
	match b.kind:
		"destruction_maker":
			boss_keep_distance(b, 320.0, 120.0, delta)
			boss_hop(b, -520.0, 1.2, 3.0, delta)
			if b.attack_cooldown <= 0:
				lob(boss_hand(b), grave.x + randf_range(-40, 40), "lava")
				if angry:
					lob(boss_hand(b), grave.x + randf_range(-170, 170), "lava")
				b.throw_anim = 0.25
				b.attack_cooldown = randf_range(1.3, 2.1) * rate
		"unstable_core":
			# Big hops right at Grave, purple orbs, and more Unstable
			b.hop_cooldown -= delta
			if b.hop_cooldown <= 0 and b.y >= FLOOR_Y:
				b.vy = -700.0
				b.vx = signf(dx) * 240.0
				b.hop_cooldown = randf_range(1.6, 2.6)
			if b.attack_cooldown <= 0:
				for off in [-130.0, 0.0, 130.0]:
					lob(Vector2(b.x, b.y - b.h * 0.7), grave.x + off, "orb")
				b.attack_cooldown = 2.4 * rate
			boss_summon(b, ["unstable"], 2, 7.0, delta)
		"broodmother":
			boss_keep_distance(b, 270.0, 170.0, delta)
			if b.attack_cooldown <= 0:
				lob(Vector2(b.x + 30 * b.facing, b.y - b.h * 0.6), grave.x + randf_range(-30, 30), "web")
				b.attack_cooldown = 1.8 * rate
			boss_summon(b, ["spider"], 3, 6.0, delta)
		"grand_witch":
			# Flies above Grave and rains down spells
			var target_x := grave.x + sin(b.t * 0.6) * 260.0
			b.x += clampf(target_x - b.x, -200.0 * delta, 200.0 * delta)
			b.y = FLOOR_Y - 230.0 + sin(b.t * 1.7) * 25.0
			if b.attack_cooldown <= 0:
				play_limited("cackle", 0.3, 1.0, 0.7)
				for spread in [-0.25, 0.0, 0.25]:
					shoot_at(Vector2(b.x + 20 * b.facing, b.y - 70), grave_chest(), 300.0, "soundwave", spread)
				b.attack_cooldown = 1.6 * rate
			boss_summon(b, ["skeleton"], 2, 7.0, delta)
		"kraken":
			boss_keep_distance(b, 380.0, 70.0, delta)
			boss_hop(b, -380.0, 2.5, 4.0, delta)
			if b.attack_cooldown <= 0:
				for off in [-110.0, 0.0, 110.0]:
					lob(Vector2(b.x, b.y - b.h * 0.8), grave.x + off, "ink")
				b.attack_cooldown = 2.0 * rate
			boss_summon(b, ["crab", "shark", "octopus"], 2, 6.0, delta)

	# Ground bosses fall and land; the Grand Witch flies
	if b.kind != "grand_witch":
		b.vy += GRAVITY * delta
		b.x += b.vx * delta
		b.y += b.vy * delta
		if b.y >= FLOOR_Y:
			b.y = FLOOR_Y
			b.vy = 0.0
			b.vx = 0.0
	b.x = clampf(b.x, min_x() + 40.0, max_x() - 40.0)

	# Touching a boss hurts and knocks Grave back
	if b.contact > 0 and grave.invuln <= 0 \
		and absf(grave.x - b.x) < (grave.w + b.w) / 2 - 6 \
		and grave.y > b.y - b.h and grave.y - grave.h < b.y:
		hurt_grave(b.contact, HP_COLOR)
		grave.x = clampf(grave.x + (80.0 if grave.x >= b.x else -80.0), grave.w, WORLD_W - grave.w)


func boss_keep_distance(b: Boss, dist: float, speed: float, delta: float) -> void:
	var side := -1.0 if grave.x >= b.x else 1.0
	var target_x := grave.x + side * dist
	if absf(target_x - b.x) > 10:
		b.x += signf(target_x - b.x) * speed * delta
		b.walk_time += delta


func boss_hop(b: Boss, power: float, min_wait: float, max_wait: float, delta: float) -> void:
	b.hop_cooldown -= delta
	if b.hop_cooldown <= 0 and b.y >= FLOOR_Y:
		b.vy = power
		b.hop_cooldown = randf_range(min_wait, max_wait)


func boss_summon(b: Boss, kinds: Array, count: int, interval: float, delta: float) -> void:
	b.summon_cooldown -= delta
	if b.summon_cooldown > 0:
		return
	b.summon_cooldown = interval
	var minions := 0
	for e: Enemy in enemies:
		if e.minion:
			minions += 1
	for i in mini(count, MAX_MINIONS - minions):
		spawn_enemy(kinds[randi() % kinds.size()], true, b.x)


func boss_hand(b: Boss) -> Vector2:
	return Vector2(b.x + 14 * b.facing, b.y - b.h - 6)


func boss_death() -> void:
	var mid := Vector2(boss.x, boss.y - boss.h / 2)
	steam(mid, 70)
	burst(mid, 40, BOSSES[boss.kind]["color"], 260.0, 6.0)
	float_text(Vector2(boss.x, boss.y - boss.h - 40), "EVAPORATED!", ACCENT, 2.5)
	play_sound("goblin_death", 1.0, 1.0 if boss.kind == "destruction_maker" else 0.7)
	boss = null
	place_phase = "cleared"
	# Its minions evaporate with it
	for e: Enemy in enemies:
		steam(Vector2(e.x, e.y - e.h / 2), 10)
	enemies.clear()
	shots.clear()
	if not is_cleared(scene):
		var cleared: Array = progress["cleared"]
		cleared.append(scene)


# ---------- inside the van: the map on the wall ----------

func van_walk(delta: float) -> void:
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


func update_hub(delta: float) -> void:
	van_walk(delta)
	# The map opens when Grave gets close to it
	map_open = grave.x > MAP_X - 30 and grave.x < MAP_X + MAP_W + 30
	if not map_open:
		map_choice = ""
		map_index = -1
		return
	var m := get_local_mouse_position()
	map_index = -1
	for i in 3:
		if map_card_rect(i).has_point(m):
			map_index = i
	if map_choice != "":
		var choice := map_choice
		map_choice = ""
		if is_unlocked(choice):
			play_sound("select", 0.7)
			board_van(choice)
		else:
			var needed := "cave" if choice == "warehouse" else "warehouse"
			show_hint("Locked! Clear %s first." % scene_name(needed), 2.5)


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
	if status == "loading":
		draw_loading()
		return
	if status == "menu":
		draw_menu()
		return
	if status == "title":
		draw_title_card()
		return
	if scene == "keeper":
		draw_van_room()
		draw_van_hud()
		draw_end_screens()
		return
	if scene == "hub":
		draw_van_room()
		draw_hub_hud()
		return

	match scene:
		"forest":
			draw_forest()
		"resting":
			draw_resting()
		"cave":
			draw_cave()
		"warehouse":
			draw_warehouse()
		"beach":
			draw_beach()
	draw_van_exterior(van_world_x() - cam_x)
	if boss != null:
		draw_boss(boss)
	for e: Enemy in enemies:
		draw_enemy(e)
	if status != "driving" and status != "arriving":
		draw_grave()
	for s: Shot in shots:
		draw_shot(s)
	for b: Beam in beams:
		draw_beam(b)
	for p: Particle in particles:
		draw_rect(Rect2(p.pos.x - cam_x - p.size / 2, p.pos.y - p.size / 2, p.size, p.size),
			Color(p.color, maxf(0.0, p.life / p.max_life)))
	for t: FloatText in texts:
		text(t.text, t.pos.x - cam_x, t.pos.y, 16, Color(t.color, minf(1.0, t.life * 2)))
	if scene == "cave":
		# Only a little light around Grave in the dark cave
		var c := Vector2(grave.x - cam_x, grave.y - 50)
		darkness(c, 240.0, 0.4)
		darkness(c, 380.0, 0.4)
	draw_hud()

	# Fade to black as the van drives off
	if status == "driving":
		draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color(0.03, 0.02, 0.05, clampf((phase_time - 1.0) / (DRIVE_TIME - 1.0), 0.0, 1.0)))
	draw_end_screens()


# ---------- save file chooser ----------

func draw_menu() -> void:
	sky(Color("#02030a"), Color("#0b1a2a"))
	draw_tree_layer(0.35, 70, FLOOR_Y + 60, 140, 220, Color("#06100d"), Color("#06100d"), 7)
	draw_rect(Rect2(0, FLOOR_Y + 60, VIEW_W, VIEW_H), Color("#040806"))
	for i in 10: # green parasite eyes in the dark
		var ex := 60 + i * 92 + rand(i + 40) * 40
		var ey := 330 + rand(i + 41) * 120
		if sin(now() * (0.8 + rand(i + 42)) + i) < 0.9:
			infected_eye(Vector2(ex, ey), 2.0)
			infected_eye(Vector2(ex + 9, ey), 2.0)
	glow(Vector2(VIEW_W / 2, 70), 90, INFECTED, 0.05)
	title_text("EAP", VIEW_W / 2, 96, 72, Color("#d8ffc8"), INFECTED)
	text("EVAPORATE ALL PARASITES", VIEW_W / 2, 126, 18, Color("#e6e9ef"))
	text("A parasite virus has infected every creature.", VIEW_W / 2, 150, 13, INFECTED)
	for i in 3:
		var r := slot_rect(i)
		var selected := i == menu_index
		window_box(r, 0.95 if selected else 0.8)
		if selected:
			draw_pointer(Vector2(r.position.x - 8, r.get_center().y), 16.0)
		var col := Color("#ffe58a") if selected else Color.WHITE
		text("SAVE %d" % (i + 1), r.position.x + 20, r.position.y + 32, 20, col, HORIZONTAL_ALIGNMENT_LEFT)
		var saved: Dictionary = slots[i]
		if saved.is_empty():
			text("Empty - new game", r.position.x + 140, r.position.y + 32, 18, col, HORIZONTAL_ALIGNMENT_LEFT)
			continue
		var cp: String = saved["checkpoint"]
		var cleared: Array = saved["cleared"]
		text("GRAVE", r.position.x + 140, r.position.y + 32, 18, col, HORIZONTAL_ALIGNMENT_LEFT)
		text("LV %d" % (cleared.size() + 1), r.position.x + 240, r.position.y + 32, 18, col, HORIZONTAL_ALIGNMENT_LEFT)
		text("Completed!" if cp == "done" else scene_name(cp), r.position.x + 20, r.position.y + 66, 14, Color("#b8c4e8"), HORIZONTAL_ALIGNMENT_LEFT)
		var er := erase_rect(i)
		var armed := erase_armed == i
		window_box(er, 0.9)
		text("SURE?" if armed else "ERASE", er.get_center().x, er.position.y + 23, 13, Color("#ff6a5a") if armed else Color("#b8c4e8"))
	text("1-3 or click: start     W/S: move     X twice: erase     M: sound", VIEW_W / 2, VIEW_H - 16, 12, Color("#8a94b0"))
	text(VERSION, 12, 22, 12, INFECTED, HORIZONTAL_ALIGNMENT_LEFT)


# ---------- the map inside the van ----------

func draw_map_board() -> void:
	var r := Rect2(MAP_X, 105, MAP_W, 150)
	if map_open:
		glow(r.get_center(), 120, Color("#ffcf5a"), 0.05)
	draw_rect(r.grow(6), Color("#3b2a1a"))
	draw_rect(r, Color("#d9c9a3"))
	text("MAP", r.get_center().x, r.position.y + 22, 16, Color("#3b2a1a"))
	var pts := [Vector2(MAP_X + 45, 215), Vector2(MAP_X + 125, 165), Vector2(MAP_X + 205, 215)]
	draw_polyline(PackedVector2Array(pts), Color("#7a5a3a"), 2.0)
	for i in 3:
		var place: String = MAP_ORDER[i]
		var c := Color("#2f8f5a") if is_cleared(place) else (Color("#b03a2e") if is_unlocked(place) else Color("#6b6b6b"))
		draw_circle(pts[i], 10, c)
		text(str(i + 1), pts[i].x, pts[i].y + 5, 12, Color.WHITE)


func draw_place_icon(place: String, c: Vector2, unlocked: bool) -> void:
	var ink := Color("#e8eefc") if unlocked else Color("#505870")
	match place:
		"cave":
			var arch := PackedVector2Array()
			for i in 13:
				arch.append(c + Vector2.from_angle(PI + i * PI / 12.0) * 34.0 + Vector2(0, 16))
			draw_colored_polygon(arch, ink)
			for sx in [-14.0, 0.0, 14.0]:
				draw_colored_polygon(PackedVector2Array([c + Vector2(sx - 5, -10), c + Vector2(sx + 5, -10), c + Vector2(sx, 4)]), WIN_BOTTOM)
		"warehouse":
			draw_rect(Rect2(c.x - 34, c.y - 14, 68, 32), ink)
			draw_colored_polygon(PackedVector2Array([c + Vector2(-40, -14), c + Vector2(40, -14), c + Vector2(0, -36)]), ink)
			draw_rect(Rect2(c.x - 10, c.y, 20, 18), WIN_BOTTOM)
		"beach":
			draw_circle(c + Vector2(14, -14), 14, ink)
			for j in 3:
				var pts := PackedVector2Array()
				for k in 9:
					pts.append(c + Vector2(-36 + k * 9, 6 + j * 9 + sin(k * 1.4) * 3))
				draw_polyline(pts, ink, 3.0)


func draw_map_overlay() -> void:
	draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color(0, 0, 0, 0.6))
	var panel := Rect2(VIEW_W / 2 - 390, 70, 780, 380)
	window_box(panel)
	text("Where to next?", panel.position.x + 30, panel.position.y + 42, 22, Color.WHITE, HORIZONTAL_ALIGNMENT_LEFT)
	for i in 3:
		var place: String = MAP_ORDER[i]
		var r := map_card_rect(i)
		var unlocked := is_unlocked(place)
		var selected := map_index == i and unlocked
		window_box(r, 0.95 if selected else 0.75)
		if selected:
			draw_pointer(Vector2(r.position.x + 4, r.position.y + 22), 14.0)
		var col := Color("#ffe58a") if selected else (Color.WHITE if unlocked else Color("#6a7290"))
		text("[%d]" % (i + 1), r.position.x + 22, r.position.y + 28, 14, col, HORIZONTAL_ALIGNMENT_LEFT)
		draw_place_icon(place, Vector2(r.get_center().x, r.position.y + 74), unlocked)
		var y := r.position.y + 132
		var place_name: String = PLACES[place]["name"]
		for line in wrap_text(place_name, 15, r.size.x - 24):
			text(line, r.get_center().x, y, 15, col)
			y += 20
		for k in PLACES[place]["quota"]:
			text("%d %s" % [quota_of(place, k), ENEMY[k]["plural"]], r.get_center().x, y, 12, Color("#b8c4e8"))
			y += 16
		text("Boss: " + BOSSES[PLACES[place]["boss"]]["name"], r.get_center().x, y + 4, 12, Color("#ff8a7a"))
		var state := "CLEARED" if is_cleared(place) else ("GO!" if unlocked else "LOCKED")
		var sc := INFECTED if is_cleared(place) else (Color("#ffe58a") if unlocked else Color("#6a7290"))
		text(state, r.get_center().x, r.end.y - 14, 16, sc)
	text("Press 1, 2 or 3, or click a place. Walk away to close the map.", VIEW_W / 2, panel.end.y - 14, 12, Color("#b8c4e8"))


func draw_hub_hud() -> void:
	dialog(VIEW_W / 2 - 300, 12, 600, "The EAP van. Walk up to the map on the wall.", 15)
	text("Esc: save files   M: sound", VIEW_W - 12, VIEW_H - 12, 12, Color("#8a94b0"), HORIZONTAL_ALIGNMENT_RIGHT)
	if map_open:
		draw_map_overlay()
	if hint_time > 0 and not map_open:
		dialog(VIEW_W / 2 - 300, VIEW_H - 100, 600, hint, 15)


# ---------- HUD and screens ----------

func draw_hud() -> void:
	# Status window along the bottom: name, level, HP, battery, charge
	var sw := Rect2(8, VIEW_H - 50, VIEW_W - 16, 44)
	window_box(sw, 0.88)
	var y := sw.position.y + 29
	text("GRAVE", 24, y, 18, Color.WHITE, HORIZONTAL_ALIGNMENT_LEFT)
	text("LV %d" % level_number(), 104, y, 16, Color("#b8c4e8"), HORIZONTAL_ALIGNMENT_LEFT)
	text("HP", 170, y, 14, Color("#ffe58a"), HORIZONTAL_ALIGNMENT_LEFT)
	shiny_bar(Rect2(198, y - 13, 130, 14), grave.hp / GRAVE_MAX_HP, Color("#3ee07a") if grave.hp > 30 else Color("#ff4a3a"))
	text("%d/%d" % [ceili(grave.hp), int(GRAVE_MAX_HP)], 338, y, 15, Color.WHITE, HORIZONTAL_ALIGNMENT_LEFT)
	text("BATTERY", 420, y, 13, Color("#9fd7ff"), HORIZONTAL_ALIGNMENT_LEFT)
	shiny_bar(Rect2(492, y - 13, 110, 14), grave.battery / BATTERY_MAX, BATTERY_COLOR)
	if grave.battery <= 0:
		text("EMPTY", 547, y - 1, 11, Color("#ff8a7a"))
	text("CHARGE", 620, y, 13, Color("#ffe58a"), HORIZONTAL_ALIGNMENT_LEFT)
	shiny_bar(Rect2(684, y - 13, 110, 14), grave.charge / MAX_CHARGE, BEAM_COLOR)
	text("Esc: saves  M: sound", VIEW_W - 22, y, 11, Color("#8a94b0"), HORIZONTAL_ALIGNMENT_RIGHT)

	# How many infected monsters are left here
	var place: Dictionary = PLACES[scene]
	var box := Rect2(VIEW_W - 300, 10, 290, 36 + kills.size() * 22)
	window_box(box, 0.85)
	text(place["name"], box.end.x - 16, box.position.y + 24, 13, place["color"], HORIZONTAL_ALIGNMENT_RIGHT)
	var ky := box.position.y + 48
	for k in kills:
		var need := quota_of(scene, k)
		var got := mini(int(kills[k]), need)
		var short: String = ENEMY[k]["short"]
		text("%s  %d/%d" % [short, got, need], box.end.x - 16, ky, 15, INFECTED if got >= need else Color.WHITE, HORIZONTAL_ALIGNMENT_RIGHT)
		ky += 22

	if boss != null:
		var bb := Rect2(10, 10, 420, 54)
		window_box(bb, 0.88)
		text(boss.name, bb.position.x + 16, bb.position.y + 24, 15, Color("#ff8a7a"), HORIZONTAL_ALIGNMENT_LEFT)
		shiny_bar(Rect2(bb.position.x + 16, bb.position.y + 32, 388, 12), boss.hp / boss.max_hp, Color("#e8344a"))
		if boss_banner > 0:
			var a := minf(1.0, boss_banner)
			title_text("BOSS: " + boss.name, VIEW_W / 2, 220, 36, Color(1.0, 0.85, 0.6, a), Color(1.0, 0.3, 0.25, a))

	if hint_time > 0:
		dialog(VIEW_W / 2 - 320, 124, 640, hint, 15)


func draw_end_screens() -> void:
	if status == "lost":
		draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color(0.05, 0, 0, minf(0.9, status_time * 2.0)))
		title_text("GAME OVER", VIEW_W / 2, 200, 72, Color(1.0, 0.75, 0.7, minf(1.0, status_time)), Color(0.85, 0.1, 0.1, minf(1.0, status_time)))
		dialog(VIEW_W / 2 - 340, 300, 680, current_dialog(), 17, typed_letters(0.9))
	elif status == "won":
		draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color(0, 0, 0, minf(0.8, status_time * 2.0)))
		glow(Vector2(VIEW_W / 2, 170), 120, INFECTED, 0.06)
		title_text("YOU ESCAPED THE VAN", VIEW_W / 2, 200, 52, Color("#e8ffd8"), INFECTED)
		dialog(VIEW_W / 2 - 340, 280, 680, current_dialog(), 17, typed_letters(0.6))


func draw_title_card() -> void:
	sky(Color("#000000"), Color("#0a0f2a"))
	var a := clampf(minf(phase_time / 0.4, (TITLE_TIME - phase_time) / 0.4), 0.0, 1.0)
	var color := Color.WHITE
	if PLACES.has(next_scene):
		color = PLACES[next_scene]["color"]
	elif next_scene == "keeper":
		color = KEEPER_EYES
		draw_keys_keeper(VIEW_W / 2, 360, 0.9, a, Color("#241a30"))
	glow(Vector2(VIEW_W / 2, 100), 90, color, 0.05 * a)
	title_text(scene_name(next_scene), VIEW_W / 2, 118, 44, Color(color.lightened(0.6), a), Color(color, a))
	text("Health and battery refilled. Game saved.", VIEW_W / 2, 156, 13, Color(0.7, 0.75, 0.9, a))
	dialog(VIEW_W / 2 - 380, 380, 760, title_line(), 17, typed_letters(0.3))


# ---------- drawing helpers ----------

func ellipse(c: Vector2, rx: float, ry: float, color: Color) -> void:
	var pts := PackedVector2Array()
	for i in 20:
		pts.append(c + Vector2(cos(i * TAU / 20.0) * rx, sin(i * TAU / 20.0) * ry))
	draw_colored_polygon(pts, color)


# Darken everything outside a circle (for the dark cave)
func darkness(center: Vector2, radius: float, alpha: float) -> void:
	var seg := 40
	for i in seg:
		var a0 := i * TAU / seg
		var a1 := (i + 1) * TAU / seg
		draw_colored_polygon(PackedVector2Array([
			center + Vector2.from_angle(a0) * radius,
			center + Vector2.from_angle(a1) * radius,
			center + Vector2.from_angle(a1) * 1600.0,
			center + Vector2.from_angle(a0) * 1600.0,
		]), Color(0, 0, 0, alpha))


# Text with a drop shadow. x is the centre (or the left / right edge), y is the baseline.
func text(s: String, x: float, y: float, size: int, color: Color, align: HorizontalAlignment = HORIZONTAL_ALIGNMENT_CENTER) -> void:
	var font := ThemeDB.fallback_font
	var left := x
	if align == HORIZONTAL_ALIGNMENT_CENTER:
		left = x - text_width(s, size) / 2.0
	elif align == HORIZONTAL_ALIGNMENT_RIGHT:
		left = x - text_width(s, size)
	var shadow := maxf(1.0, size / 9.0)
	draw_string(font, Vector2(left + shadow, y + shadow), s, HORIZONTAL_ALIGNMENT_LEFT, -1, size, Color(0, 0, 0, 0.75 * color.a))
	draw_string(font, Vector2(left, y), s, HORIZONTAL_ALIGNMENT_LEFT, -1, size, color)


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


# ---------- the scary forest ----------

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


# Twisted dead trees between the pines
func draw_dead_trees(depth: float) -> void:
	var off := cam_x * depth
	var first := int(floorf(off / 260.0)) - 1
	var c := Color("#1a1512")
	for i in range(first, first + int(VIEW_W / 260.0) + 3):
		var x := i * 260 + rand(i + 90) * 120 - off
		var h := 160 + rand(i + 91) * 90
		draw_colored_polygon(PackedVector2Array([
			Vector2(x - 9, FLOOR_Y), Vector2(x - 4, FLOOR_Y - h), Vector2(x + 4, FLOOR_Y - h), Vector2(x + 9, FLOOR_Y),
		]), c)
		for j in 4:
			var by := FLOOR_Y - h * (0.45 + j * 0.15)
			var side := -1.0 if j % 2 == 0 else 1.0
			draw_line(Vector2(x, by), Vector2(x + side * (30 + rand(i * 7 + j) * 30), by - 25 - rand(i * 5 + j) * 20), c, 4.0 - j * 0.7)


func draw_forest() -> void:
	var time := now()
	sky(Color("#03050a"), Color("#141b1a"))
	for i in 40:
		var sx := fposmod(rand(i) * VIEW_W * 2.0 - cam_x * 0.05, VIEW_W)
		draw_rect(Rect2(sx, rand(i + 99) * 180.0, 2, 2), Color(1, 1, 1, 0.4))

	# Blood-red moon
	var moon := Vector2(780 - cam_x * 0.05, 90)
	glow(moon, 40, Color("#ff4a3a"), 0.08)
	draw_circle(moon, 34, Color("#a8322a"))
	draw_circle(moon + Vector2(-9, -7), 8, Color("#8f2a23"))
	draw_circle(moon + Vector2(10, 9), 5, Color("#8f2a23"))

	var hills := PackedVector2Array([Vector2(0, FLOOR_Y)])
	for x in range(0, int(VIEW_W) + 1, 20):
		var hx := x + cam_x * 0.2
		hills.append(Vector2(x, 300 + sin(hx * 0.006) * 30 + sin(hx * 0.017) * 12))
	hills.append(Vector2(VIEW_W, FLOOR_Y))
	draw_colored_polygon(hills, Color("#0d1b19"))
	draw_tree_layer(0.35, 70, FLOOR_Y - 20, 120, 190, Color("#0c1d18"), Color("#0c1d18"), 1)

	# Glowing eyes watching from the dark, blinking now and then
	for i in 14:
		var ex := fposmod(i * 211.0 + rand(i + 70) * 150 - cam_x * 0.45, VIEW_W + 100) - 50
		var ey := FLOOR_Y - 60 - rand(i + 71) * 140
		var blink := sin(time * (0.7 + rand(i + 72)) + i * 3.0) > 0.92
		if not blink and rand(i + 73) > 0.35:
			draw_rect(Rect2(ex, ey, 3, 2), Color(1.0, 0.25, 0.2, 0.8))
			draw_rect(Rect2(ex + 7, ey, 3, 2), Color(1.0, 0.25, 0.2, 0.8))

	draw_tree_layer(0.6, 110, FLOOR_Y, 180, 280, Color("#11281f"), Color("#1d1a15"), 50)
	draw_dead_trees(0.8)

	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y), Color("#2a2018"))
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, 10), Color("#1f4a2a"))
	var gx := floorf(cam_x / 12.0) * 12.0
	while gx < cam_x + VIEW_W:
		var gh := 4 + rand(gx) * 8
		draw_rect(Rect2(gx - cam_x, FLOOR_Y - gh, 3, gh), Color("#2b5e34"))
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

	# Low fog drifting over the ground
	for i in 6:
		var fog_x := fposmod(i * 260 + time * (10 + i * 3) - cam_x * 0.8, VIEW_W + 400) - 200
		for j in 3:
			draw_circle(Vector2(fog_x, FLOOR_Y - 6), 150 - j * 45, Color(0.75, 0.8, 0.8, 0.045))


# ---------- the dark cave ----------

func draw_cave() -> void:
	sky(Color("#07060a"), Color("#16110d"))
	# Far rock wall
	var off := cam_x * 0.3
	var wall := PackedVector2Array([Vector2(0, FLOOR_Y)])
	for x in range(0, int(VIEW_W) + 1, 24):
		var wx := x + off
		wall.append(Vector2(x, 150 + sin(wx * 0.011) * 40 + sin(wx * 0.031) * 18))
	wall.append(Vector2(VIEW_W, FLOOR_Y))
	draw_colored_polygon(wall, Color("#1c1611"))

	# Glowing crystals in the rock
	var first := int(floorf(off / 140.0)) - 1
	for i in range(first, first + 10):
		var cx := i * 140 + rand(i + 200) * 90 - off
		var cy := 220 + rand(i + 201) * 160
		var col := Color("#3ff2d6") if rand(i + 202) > 0.5 else Color("#b45cff")
		glow(Vector2(cx, cy), 10, col, 0.12)
		draw_colored_polygon(PackedVector2Array([Vector2(cx - 5, cy + 8), Vector2(cx, cy - 12), Vector2(cx + 5, cy + 8)]), col)

	# Stalactites hanging from the ceiling (the spiders drop from up here)
	var off2 := cam_x * 0.7
	draw_rect(Rect2(0, 0, VIEW_W, 30), Color("#0d0a08"))
	var first2 := int(floorf(off2 / 60.0)) - 1
	for i in range(first2, first2 + 19):
		var sx := i * 60 + rand(i + 300) * 40 - off2
		var sh := 40 + rand(i + 301) * 90
		draw_colored_polygon(PackedVector2Array([Vector2(sx - 14, 28), Vector2(sx + 14, 28), Vector2(sx + 2, 28 + sh)]), Color("#2a211a"))
		if rand(i + 302) > 0.7:
			# Cobweb between two stalactites
			draw_line(Vector2(sx, 50), Vector2(sx + 60, 50), Color(0.85, 0.85, 0.9, 0.2), 1.0)
			draw_line(Vector2(sx + 6, 36), Vector2(sx + 50, 70), Color(0.85, 0.85, 0.9, 0.2), 1.0)
			draw_line(Vector2(sx + 54, 36), Vector2(sx + 10, 70), Color(0.85, 0.85, 0.9, 0.2), 1.0)

	# Ground with stalagmites
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y), Color("#1a140f"))
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, 5), Color("#2c231b"))
	var first3 := int(floorf(cam_x / 180.0)) - 1
	for i in range(first3, first3 + 8):
		var gx := i * 180 + rand(i + 400) * 100 - cam_x
		var gh := 20 + rand(i + 401) * 40
		draw_colored_polygon(PackedVector2Array([Vector2(gx - 12, FLOOR_Y), Vector2(gx + 1, FLOOR_Y - gh), Vector2(gx + 12, FLOOR_Y)]), Color("#2a211a"))


# ---------- the creepy warehouse ----------

func draw_warehouse() -> void:
	var time := now()
	# Brick back wall
	draw_rect(Rect2(0, 0, VIEW_W, FLOOR_Y), Color("#24191a"))
	var off := cam_x * 0.5
	for row in range(0, int(FLOOR_Y / 22.0) + 1):
		var y := row * 22.0
		draw_line(Vector2(0, y), Vector2(VIEW_W, y), Color("#1a1213"), 2.0)
		var bx := -fposmod(off + (0.0 if row % 2 == 0 else 24.0), 48.0)
		while bx < VIEW_W:
			draw_line(Vector2(bx, y), Vector2(bx, y + 22), Color("#1a1213"), 2.0)
			bx += 48.0

	# Broken windows with the moon outside
	var first := int(floorf(off / 420.0)) - 1
	for i in range(first, first + 5):
		var wx := i * 420 + 120 - off
		draw_rect(Rect2(wx, 60, 140, 90), Color("#0a1020"))
		draw_circle(Vector2(wx + 100, 90), 14, Color("#d8e0c8"))
		draw_rect(Rect2(wx, 60, 140, 90), Color("#3a2c22"), false, 5.0)
		draw_line(Vector2(wx + 70, 60), Vector2(wx + 70, 150), Color("#3a2c22"), 4.0)
		draw_line(Vector2(wx, 105), Vector2(wx + 140, 105), Color("#3a2c22"), 4.0)
		draw_colored_polygon(PackedVector2Array([Vector2(wx + 74, 64), Vector2(wx + 120, 64), Vector2(wx + 90, 90)]), Color(0.6, 0.7, 0.8, 0.25))

	# Tall shelves full of crates
	var off2 := cam_x * 0.8
	var first2 := int(floorf(off2 / 300.0)) - 1
	for i in range(first2, first2 + 5):
		var sx := i * 300 + rand(i + 500) * 60 - off2
		draw_rect(Rect2(sx, 200, 8, FLOOR_Y - 200), Color("#3a2e22"))
		draw_rect(Rect2(sx + 180, 200, 8, FLOOR_Y - 200), Color("#3a2e22"))
		for board_y in [260.0, 340.0, FLOOR_Y - 10]:
			draw_rect(Rect2(sx, board_y, 188, 6), Color("#4a3a2a"))
			for k in 3:
				if rand(i * 11 + k + board_y) > 0.3:
					var cx := sx + 12 + k * 58
					draw_rect(Rect2(cx, board_y - 40, 44, 40), Color("#6b4e2e"))
					draw_rect(Rect2(cx, board_y - 40, 44, 40), Color("#4a341e"), false, 2.0)
					draw_line(Vector2(cx, board_y - 40), Vector2(cx + 44, board_y), Color("#4a341e"), 2.0)

	# Hanging lamps that flicker
	var first3 := int(floorf(cam_x / 360.0)) - 1
	for i in range(first3, first3 + 5):
		var lx := i * 360 + 180 - cam_x
		var flick := 0.3 if sin(time * 13.0 + i * 5.0) > 0.85 else 1.0
		draw_line(Vector2(lx, 0), Vector2(lx, 70), Color("#111111"), 2.0)
		draw_colored_polygon(PackedVector2Array([Vector2(lx - 16, 82), Vector2(lx + 16, 82), Vector2(lx + 8, 70), Vector2(lx - 8, 70)]), Color("#2b2b2b"))
		draw_colored_polygon(PackedVector2Array([
			Vector2(lx - 14, 82), Vector2(lx + 14, 82), Vector2(lx + 110, FLOOR_Y), Vector2(lx - 110, FLOOR_Y),
		]), Color(1.0, 0.85, 0.5, 0.06 * flick))
		draw_circle(Vector2(lx, 84), 5, Color(1.0, 0.9, 0.6, flick))

	# Concrete floor
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y), Color("#2e2c2a"))
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, 5), Color("#3d3a37"))
	for i in int(WORLD_W / 150):
		var px := i * 150 + rand(i + 800) * 90
		if px < cam_x - 40 or px > cam_x + VIEW_W + 40:
			continue
		ellipse(Vector2(px - cam_x, FLOOR_Y + 30 + rand(i + 801) * 40), 22, 5, Color(0.1, 0.09, 0.08, 0.5))


# ---------- the beach of doom ----------

func draw_beach() -> void:
	var time := now()
	sky(Color("#2a0a10"), Color("#b0452a"))
	# A sick, greenish sun sinking into the sea
	var sun := Vector2(620 - cam_x * 0.04, 280)
	glow(sun, 60, Color("#c8ff6a"), 0.07)
	draw_circle(sun, 50, Color("#d8b24a"))

	# The sea, with moving waves
	var sea_top := 330.0
	draw_rect(Rect2(0, sea_top, VIEW_W, FLOOR_Y - sea_top), Color("#1d3b3a"))
	for j in 4:
		var pts := PackedVector2Array()
		for x in range(0, int(VIEW_W) + 1, 16):
			var wx := x + cam_x * (0.3 + j * 0.15)
			pts.append(Vector2(x, sea_top + 10 + j * 26 + sin(wx * 0.03 + time * (1.5 + j * 0.4)) * 4))
		draw_polyline(pts, Color(0.55, 0.85, 0.8, 0.35), 2.0)

	# Dead palm trees
	var off := cam_x * 0.85
	var first := int(floorf(off / 380.0)) - 1
	for i in range(first, first + 5):
		var px := i * 380 + rand(i + 600) * 120 - off
		var top := Vector2(px + 26, FLOOR_Y - 170)
		draw_polyline(PackedVector2Array([Vector2(px, FLOOR_Y), Vector2(px + 10, FLOOR_Y - 85), top]), Color("#4a3424"), 8.0)
		for k in 5:
			var a := -PI * 0.15 - k * 0.6
			var tip := top + Vector2(cos(a) * 60, sin(a) * 25 + 40)
			draw_line(top, tip, Color("#5a4a2a"), 4.0)

	# Sand, shells and infected slime
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, VIEW_H - FLOOR_Y), Color("#b89a62"))
	draw_rect(Rect2(0, FLOOR_Y, VIEW_W, 6), Color("#8f7444"))
	for i in int(WORLD_W / 120):
		var bx := i * 120 + rand(i + 700) * 80
		if bx < cam_x - 40 or bx > cam_x + VIEW_W + 40:
			continue
		var by := FLOOR_Y + 20 + rand(i + 702) * 50
		if rand(i + 701) > 0.6:
			ellipse(Vector2(bx - cam_x, by), 18, 5, Color(0.55, 1.0, 0.35, 0.5))
		else:
			draw_rect(Rect2(bx - cam_x, by, 6, 4), Color("#e8dcc0"))


# ---------- the van (outside) ----------

func van_world_x() -> float:
	if scene == "forest":
		var t := maxf(0.0, phase_time - 0.4) if status == "driving" else 0.0
		return VAN_X + t * t * 400
	if status == "arriving":
		var k := minf(1.0, phase_time / ARRIVE_TIME)
		var eased := 1.0 - pow(1.0 - k, 3)
		return VAN_PARK_X - 700 * (1.0 - eased)
	return VAN_PARK_X


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
	var a := aim_angle() if PLACES.has(scene) else (0.0 if grave.facing == 1 else PI)
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


# ---------- monsters ----------
# Each one is drawn facing right with its feet at (0, 0); draw_enemy flips and places it.

func draw_enemy(e: Enemy) -> void:
	var x := roundf(e.x - cam_x)
	if e.kind == "unstable":
		draw_unstable(e)
	else:
		if not e.flying:
			draw_set_transform(Vector2(x, FLOOR_Y + 2), 0, Vector2(1, 0.2))
			draw_circle(Vector2.ZERO, e.w * 0.45, Color(0, 0, 0, 0.3))
		if e.kind == "spider" and e.state == "dropping":
			draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
			draw_line(Vector2(x, 0), Vector2(x, e.y - e.h), Color(0.9, 0.9, 0.95, 0.6), 1.0) # silk thread
		draw_set_transform(Vector2(x, roundf(e.y)), 0, Vector2(e.facing, 1))
		var flash := e.hurt_flash > 0
		match e.kind:
			"wolf":
				draw_wolf(e, flash)
			"bear":
				draw_bear(e, flash)
			"spider":
				draw_spider(e.walk_time, flash, Color("#1b1620"))
			"witch":
				draw_witch(flash)
			"skeleton":
				draw_skeleton(e, flash)
			"crab":
				draw_crab(e, flash)
			"shark":
				draw_shark(flash)
			"octopus":
				draw_octopus(flash, e.t)
		draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	# Small health bar once it's been hit
	if e.state == "active" and e.hp < e.max_hp:
		draw_rect(Rect2(x - 16, e.y - e.h - 14, 32, 4), Color(0, 0, 0, 0.6))
		draw_rect(Rect2(x - 16, e.y - e.h - 14, 32 * e.hp / e.max_hp, 4), HP_COLOR)


func draw_wolf(e: Enemy, flash: bool) -> void:
	var fur := Color.WHITE if flash else Color("#5d6370")
	var dark := Color.WHITE if flash else Color("#3e434d")
	var step := sin(e.walk_time * 18.0) * 5.0
	draw_rect(Rect2(-18 + step, -14, 5, 14), dark) # legs
	draw_rect(Rect2(-10 - step, -14, 5, 14), fur)
	draw_rect(Rect2(8 + step, -14, 5, 14), dark)
	draw_rect(Rect2(15 - step, -14, 5, 14), fur)
	draw_colored_polygon(PackedVector2Array([Vector2(-22, -24), Vector2(-38, -32), Vector2(-30, -18)]), dark) # tail
	draw_rect(Rect2(-24, -28, 44, 16), fur) # body
	draw_rect(Rect2(-20, -14, 36, 3), Color("#8a909c"))
	draw_rect(Rect2(14, -36, 16, 14), fur) # head
	draw_colored_polygon(PackedVector2Array([Vector2(16, -36), Vector2(19, -44), Vector2(22, -36)]), dark) # ears
	draw_colored_polygon(PackedVector2Array([Vector2(23, -36), Vector2(26, -44), Vector2(29, -36)]), dark)
	draw_rect(Rect2(28, -30, 10, 7), fur) # snout
	draw_rect(Rect2(36, -31, 3, 3), Color("#111111"))
	infected_eye(Vector2(25.5, -31.5), 1.5) # glowing green eye
	draw_rect(Rect2(-8, -26, 5, 2), INFECTED) # infection veins
	draw_rect(Rect2(2, -22, 7, 2), INFECTED)
	draw_rect(Rect2(30, -24, 2, 3), Color.WHITE) # fang


func draw_bear(e: Enemy, flash: bool) -> void:
	var fur := Color.WHITE if flash else Color("#5a3a22")
	var dark := Color.WHITE if flash else Color("#3d2615")
	var step := sin(e.walk_time * 9.0) * 4.0
	for lx in [-28.0, -14.0, 8.0, 20.0]:
		draw_rect(Rect2(lx + step, -20, 9, 20), dark if lx < 0 else fur) # legs
		draw_rect(Rect2(lx + step + 6, -3, 4, 3), Color("#e8e2cf")) # claws
		step = -step
	draw_rect(Rect2(-32, -52, 60, 36), fur) # body
	draw_circle(Vector2(-8, -48), 20, fur) # shoulder hump
	draw_circle(Vector2(28, -46), 15, fur) # head
	draw_circle(Vector2(20, -59), 5, dark) # ears
	draw_circle(Vector2(34, -59), 5, dark)
	draw_circle(Vector2(40, -42), 7, Color.WHITE if flash else Color("#a07850")) # muzzle
	draw_rect(Rect2(44, -46, 4, 4), Color("#111111"))
	infected_eye(Vector2(31.5, -49.5), 1.8) # glowing green eye
	draw_rect(Rect2(-20, -44, 9, 3), INFECTED) # infection veins
	draw_rect(Rect2(-4, -36, 7, 3), INFECTED)


func draw_spider(walk_time: float, flash: bool, body: Color) -> void:
	var c := Color.WHITE if flash else body
	for i in 4:
		var a := sin(walk_time * 20.0 + i) * 3.0
		draw_polyline(PackedVector2Array([Vector2(-4 + i * 3, -10), Vector2(-14 + i * 7 + a, -18), Vector2(-18 + i * 10 + a, 0)]), c, 2.0)
	draw_circle(Vector2(-5, -11), 9, c) # abdomen
	draw_circle(Vector2(7, -9), 6, c) # head
	infected_eye(Vector2(10, -11), 1.2)
	infected_eye(Vector2(12, -8), 1.2)
	draw_circle(Vector2(-6, -14), 2.5, INFECTED) # infection spot


# Witches ride brooms; their feet (0, 0) is the broom
func draw_witch(flash: bool) -> void:
	var skin := Color.WHITE if flash else Color("#79c25a")
	var dress := Color.WHITE if flash else Color("#3d1757")
	draw_line(Vector2(-28, 0), Vector2(26, 0), Color("#7a5230"), 3.0) # broom
	draw_colored_polygon(PackedVector2Array([Vector2(-28, -4), Vector2(-42, -8), Vector2(-44, 6), Vector2(-28, 4)]), Color("#c9a24a"))
	draw_colored_polygon(PackedVector2Array([Vector2(-12, -4), Vector2(12, -4), Vector2(5, -34), Vector2(-5, -34)]), dress)
	draw_line(Vector2(3, -26), Vector2(16, -18), dress, 4.0) # arm
	draw_circle(Vector2(17, -18), 3, skin)
	draw_rect(Rect2(-9, -45, 3, 12), Color("#2a1a2a")) # hair
	draw_circle(Vector2(0, -40), 8, skin) # head
	draw_colored_polygon(PackedVector2Array([Vector2(7, -41), Vector2(14, -37), Vector2(7, -37)]), skin) # nose
	infected_eye(Vector2(4, -42), 1.5) # glowing green eye
	draw_rect(Rect2(-13, -48, 26, 3), Color("#16101c")) # hat brim
	draw_colored_polygon(PackedVector2Array([Vector2(-9, -48), Vector2(9, -48), Vector2(-3, -70)]), Color("#16101c"))
	draw_rect(Rect2(-8, -52, 16, 3), Color("#7a3aa8"))


func draw_skeleton(e: Enemy, flash: bool) -> void:
	# Fades in as it climbs out of the ground
	var a := minf(1.0, e.t / EMERGE_TIME) if e.state == "emerging" else 1.0
	var bone := Color(1, 1, 1, a) if flash else Color(0.91, 0.89, 0.81, a)
	var dark := Color(0.08, 0.07, 0.06, a)
	var step := sin(e.walk_time * 12.0) * 5.0
	draw_line(Vector2(-4, -26), Vector2(-6 + step, 0), bone, 3.0) # legs
	draw_line(Vector2(4, -26), Vector2(6 - step, 0), bone, 3.0)
	draw_rect(Rect2(-8, -30, 16, 5), bone) # pelvis
	draw_line(Vector2(0, -30), Vector2(0, -53), bone, 3.0) # spine
	for i in 3:
		draw_line(Vector2(-10, -48 + i * 6), Vector2(10, -48 + i * 6), bone, 2.0) # ribs
	draw_line(Vector2(0, -50), Vector2(14, -36 - step * 0.5), bone, 3.0) # arms
	draw_line(Vector2(0, -50), Vector2(-12, -34), bone, 3.0)
	draw_circle(Vector2(0, -62), 9, bone) # skull
	draw_rect(Rect2(-5, -56, 10, 4), bone) # jaw
	draw_rect(Rect2(1, -66, 4, 4), dark) # eye sockets
	draw_rect(Rect2(-5, -66, 4, 4), dark)
	draw_rect(Rect2(2, -65, 2, 2), Color(INFECTED, a)) # glowing green eyes
	draw_rect(Rect2(-4, -65, 2, 2), Color(INFECTED, a))
	glow(Vector2(0, -63), 6, INFECTED, 0.12 * a)


func draw_crab(e: Enemy, flash: bool) -> void:
	var shell := Color.WHITE if flash else Color("#c9452c")
	for i in 3:
		var a := sin(e.walk_time * 20.0 + i) * 3.0
		draw_line(Vector2(-10 + i * 4, -8), Vector2(-20 + i * 4 + a, 0), shell, 2.0) # legs
		draw_line(Vector2(10 - i * 4, -8), Vector2(20 - i * 4 - a, 0), shell, 2.0)
	ellipse(Vector2(0, -12), 20, 11, shell)
	draw_circle(Vector2(-6, -15), 3, INFECTED) # infected spots
	draw_circle(Vector2(6, -10), 2, INFECTED)
	draw_line(Vector2(14, -14), Vector2(20, -22), shell, 3.0) # claws
	draw_line(Vector2(-14, -14), Vector2(-20, -22), shell, 3.0)
	draw_circle(Vector2(21, -24), 6, shell)
	draw_circle(Vector2(-21, -24), 6, shell)
	draw_line(Vector2(4, -20), Vector2(4, -28), shell, 2.0) # eye stalks
	draw_line(Vector2(-4, -20), Vector2(-4, -28), shell, 2.0)
	draw_circle(Vector2(4, -29), 2.5, INFECTED)
	draw_circle(Vector2(-4, -29), 2.5, INFECTED)


# Land sharks have no legs: they just fly
func draw_shark(flash: bool) -> void:
	var skin := Color.WHITE if flash else Color("#5d6b78")
	var o := Vector2(0, -20)
	var body := PackedVector2Array()
	for p in [Vector2(-40, -8), Vector2(-10, -16), Vector2(30, -12), Vector2(44, -2), Vector2(30, 8), Vector2(-10, 10), Vector2(-40, 2)]:
		body.append(o + p)
	draw_colored_polygon(body, skin)
	draw_colored_polygon(PackedVector2Array([o + Vector2(-28, 4), o + Vector2(30, 6), o + Vector2(40, 0), o + Vector2(28, 9), o + Vector2(-10, 11)]), Color("#d9dde2"))
	draw_colored_polygon(PackedVector2Array([o + Vector2(-4, -14), o + Vector2(8, -34), o + Vector2(14, -13)]), skin) # dorsal fin
	draw_colored_polygon(PackedVector2Array([o + Vector2(-38, -3), o + Vector2(-56, -22), o + Vector2(-50, 0), o + Vector2(-56, 16)]), skin) # tail
	draw_colored_polygon(PackedVector2Array([o + Vector2(0, 6), o + Vector2(10, 18), o + Vector2(14, 6)]), skin) # side fin
	draw_circle(o + Vector2(30, -5), 3, INFECTED) # infected eye
	draw_circle(o + Vector2(-14, -4), 4, Color(INFECTED, 0.7))
	draw_circle(o + Vector2(4, -9), 3, Color(INFECTED, 0.7))
	for i in 4:
		draw_colored_polygon(PackedVector2Array([o + Vector2(31 + i * 3, 3), o + Vector2(33 + i * 3, 3), o + Vector2(32 + i * 3, 7)]), Color.WHITE) # teeth


func draw_octopus(flash: bool, t: float) -> void:
	var skin := Color.WHITE if flash else Color("#6b3a8a")
	for i in 6:
		var bx := -15 + i * 6
		draw_polyline(PackedVector2Array([
			Vector2(bx, -18), Vector2(bx + sin(t * 6.0 + i) * 4, -10), Vector2(bx * 1.6 + sin(t * 6.0 + i + 1.0) * 6, 0),
		]), skin, 4.0)
	ellipse(Vector2(0, -30), 16, 18, skin)
	draw_circle(Vector2(-6, -38), 3, INFECTED)
	draw_circle(Vector2(6, -44), 2.5, INFECTED)
	draw_circle(Vector2(-9, -26), 2, INFECTED)
	draw_circle(Vector2(6, -28), 4, Color("#1a0f22"))
	draw_circle(Vector2(-3, -28), 4, Color("#1a0f22"))
	infected_eye(Vector2(6.5, -28), 1.6) # glowing green eyes
	infected_eye(Vector2(-2.5, -28), 1.6)


# ---------- bosses ----------

func draw_boss(b: Boss) -> void:
	var x := roundf(b.x - cam_x)
	var flash := b.hurt_flash > 0
	if b.kind != "grand_witch":
		draw_set_transform(Vector2(x, FLOOR_Y + 2), 0, Vector2(1, 0.18))
		draw_circle(Vector2.ZERO, b.w * 0.55, Color(0, 0, 0, 0.35))
		draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	match b.kind:
		"destruction_maker":
			draw_destruction_maker(b, x, flash)
		"unstable_core":
			draw_unstable_core(b, x, flash)
		"broodmother":
			draw_set_transform(Vector2(x, roundf(b.y)), 0, Vector2(b.facing, 1))
			draw_broodmother(b, flash)
		"grand_witch":
			glow(Vector2(x, b.y - 60), 70, Color("#b45cff"), 0.07)
			draw_set_transform(Vector2(x, roundf(b.y)), 0, Vector2(b.facing * 1.9, 1.9))
			draw_witch(flash)
		"kraken":
			glow(Vector2(x, b.y - 70), 90, INFECTED, 0.06)
			draw_set_transform(Vector2(x, roundf(b.y)), 0, Vector2(b.facing * 3.0, 3.0))
			draw_octopus(flash, b.t)
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)


func draw_destruction_maker(b: Boss, x: float, flash: bool) -> void:
	var feet := roundf(b.y)
	var step := sin(b.walk_time * 16.0) * 3.0
	var skin := Color.WHITE if flash else Color("#d4372b")
	# The drawing is made at small size and scaled up
	draw_set_transform(Vector2(x, feet), 0, Vector2(b.facing * GOBLIN_SCALE, GOBLIN_SCALE))
	draw_rect(Rect2(-8, -12, 6, 12 + step), skin) # legs
	draw_rect(Rect2(2, -12, 6, 12 - step), skin)
	var tunic := Color.WHITE if flash else Color("#3a2618")
	draw_rect(Rect2(-11, -28, 22, 18), tunic) # ragged tunic
	draw_rect(Rect2(-11, -10, 5, 3), tunic)
	draw_rect(Rect2(1, -10, 6, 3), tunic)
	draw_rect(Rect2(-10, -42, 20, 15), skin) # head
	draw_colored_polygon(PackedVector2Array([Vector2(-10, -38), Vector2(-20, -44), Vector2(-10, -32)]), skin) # ears
	draw_colored_polygon(PackedVector2Array([Vector2(10, -38), Vector2(20, -44), Vector2(10, -32)]), skin)
	infected_eye(Vector2(3, -36.5), 1.6) # glowing green eyes
	infected_eye(Vector2(-3.5, -36.5), 1.5)
	draw_rect(Rect2(-3, -31, 9, 2), Color("#1a1a1a")) # grin
	if b.throw_anim > 0:
		draw_rect(Rect2(8, -48, 5, 22), skin) # arm raised to throw
	else:
		draw_rect(Rect2(9, -26, 5, 12), skin)
		draw_circle(Vector2(12, -14), 7, LAVA_COLOR) # lava ball in hand
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)


func draw_unstable_core(b: Boss, x: float, flash: bool) -> void:
	var cy := b.y - 60.0
	draw_colored_polygon(blob_points(x - 6, cy, 62, b.t), Color(0.25, 0.95, 1.0, 0.35))
	draw_colored_polygon(blob_points(x + 6, cy, 62, b.t), Color(1.0, 0.25, 0.82, 0.35))
	glow(Vector2(x, cy), 50, UNSTABLE_COLOR, 0.12)
	draw_colored_polygon(blob_points(x, cy, 62, b.t), Color.WHITE if flash else UNSTABLE_COLOR)
	draw_circle(Vector2(x, cy - 6), 26, Color(Color("#f6d7ff"), 0.45))
	# Three eyes, all watching Grave
	var look := clampf((grave.x - b.x) / 200.0, -1.0, 1.0)
	for off in [Vector2(-24, -16), Vector2(24, -16), Vector2(0, 14)]:
		draw_circle(Vector2(x, cy) + off, 11, Color.WHITE)
		draw_circle(Vector2(x, cy) + off + Vector2(look * 5, 1), 5, INFECTED) # green iris
		draw_circle(Vector2(x, cy) + off + Vector2(look * 6, 1), 2, Color("#0a1a05"))


func draw_broodmother(b: Boss, flash: bool) -> void:
	var c := Color.WHITE if flash else Color("#1d1424")
	var step := sin(b.walk_time * 10.0) * 6.0
	for i in 4:
		for side in [-1.0, 1.0]:
			var hip := Vector2(-20 + i * 14, -50)
			var knee := Vector2(-50 + i * 34 + side * 8 + step * side, -95)
			var foot := Vector2(-70 + i * 46 + side * 10 + step * side, 0)
			draw_polyline(PackedVector2Array([hip, knee, foot]), c, 5.0)
	ellipse(Vector2(-35, -55), 42, 34, c) # abdomen
	draw_colored_polygon(PackedVector2Array([Vector2(-45, -70), Vector2(-25, -70), Vector2(-35, -56)]), Color("#c0262a")) # hourglass mark
	draw_colored_polygon(PackedVector2Array([Vector2(-45, -42), Vector2(-25, -42), Vector2(-35, -56)]), Color("#c0262a"))
	draw_circle(Vector2(30, -50), 22, c) # head
	for eye in [Vector2(38, -58), Vector2(44, -52), Vector2(32, -62), Vector2(42, -62), Vector2(46, -46), Vector2(36, -48)]:
		infected_eye(eye, 2.2)
	draw_colored_polygon(PackedVector2Array([Vector2(44, -40), Vector2(50, -40), Vector2(46, -28)]), Color("#d9d2c0")) # fangs
	draw_colored_polygon(PackedVector2Array([Vector2(36, -38), Vector2(42, -38), Vector2(38, -27)]), Color("#d9d2c0"))


func draw_shot(s: Shot) -> void:
	var p := s.pos - Vector2(cam_x, 0)
	match s.kind:
		"soundwave", "howl":
			# Rings of sound rolling forward
			var a := s.vel.angle()
			var dir := s.vel.normalized()
			for i in 3:
				var r := s.radius * (0.6 + i * 0.45) + fposmod(s.life * 40.0, 8.0)
				draw_arc(p - dir * i * 7.0, r, a - 0.9, a + 0.9, 12, Color(INFECTED, 0.9 - i * 0.25), 3.0)
		"bone":
			# A spinning green bone
			draw_set_transform(p, s.life * 14.0, Vector2.ONE)
			glow(Vector2.ZERO, 9, INFECTED, 0.15)
			draw_rect(Rect2(-9, -2, 18, 4), Color("#d8ffc8"))
			for k in [Vector2(-9, -2), Vector2(-9, 2), Vector2(9, -2), Vector2(9, 2)]:
				draw_circle(k, 3, Color("#d8ffc8"))
			draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
		_:
			glow(p, s.radius, s.color, 0.2)
			draw_circle(p, s.radius, s.color.darkened(0.35))
			draw_circle(p, s.radius * 0.7, s.color)
			draw_circle(p - Vector2(3, 3), s.radius * 0.3, s.color.lightened(0.6))


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


func draw_unstable(u: Enemy) -> void:
	var x := u.x - cam_x
	var time := now()

	# Glowing crack where it's coming out
	if u.state == "emerging":
		draw_polyline(PackedVector2Array([
			Vector2(x - 30, FLOOR_Y + 2), Vector2(x - 12, FLOOR_Y - 2), Vector2(x, FLOOR_Y + 4),
			Vector2(x + 14, FLOOR_Y - 1), Vector2(x + 30, FLOOR_Y + 3),
		]), UNSTABLE_COLOR, 3.0)

	var rise := minf(1.0, u.t / EMERGE_TIME) if u.state == "emerging" else 1.0
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

	if u.state != "emerging":
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
		draw_circle(Vector2.ZERO, 3, INFECTED) # green slit pupil
		draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)


# ---------- HUD bits ----------

func bar(x: float, y: float, w: float, h: float, frac: float, color: Color, label: String) -> void:
	draw_rect(Rect2(x, y, w, h), Color(0, 0, 0, 0.6))
	draw_rect(Rect2(x + 2, y + 2, maxf(0.0, (w - 4) * frac), h - 4), color)
	text(label, x + 6, y + h - 5, 11, Color.WHITE, HORIZONTAL_ALIGNMENT_LEFT)


func draw_overlay(title: String, sub: String, color: Color, detail := "") -> void:
	draw_rect(Rect2(0, 0, VIEW_W, VIEW_H), Color(0.02, 0.03, 0.05, 0.7))
	text(title, VIEW_W / 2, VIEW_H / 2 - 10, 44, color)
	if detail != "":
		text(detail, VIEW_W / 2, VIEW_H / 2 + 28, 16, Color("#e6e9ef"))
	text(sub, VIEW_W / 2, VIEW_H / 2 + (60 if detail != "" else 30), 18, Color("#e6e9ef"))


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

	if scene != "keeper":
		return # between trips the back door isn't locked

	# Big padlock with three keyholes
	var lx := x + w / 2
	var ly := top + 140
	draw_arc(Vector2(lx, ly - 14), 16, PI, TAU, 16, Color("#b9bec9"), 6.0)
	draw_rect(Rect2(lx - 30, ly - 14, 60, 48), Color("#c9a227"))
	var lock_slots := [
		outside_keys[0] if outside_keys.size() > 0 else "",
		inside_key,
		outside_keys[1] if outside_keys.size() > 1 else "",
	]
	for i in 3:
		var sx := lx - 18 + i * 18
		var c: Color = KEY_COLORS[lock_slots[i]] if lock_slots[i] != "" else Color("#3a2c08")
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
	if scene == "hub":
		draw_map_board()

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
	var kb := Rect2(VIEW_W - 272, 10, 262, 96)
	window_box(kb, 0.9)
	text("KEYS %d/3" % key_count(), kb.position.x + 16, kb.position.y + 26, 16, Color.WHITE, HORIZONTAL_ALIGNMENT_LEFT)
	text("outside %d/2   inside %d/1" % [outside_keys.size(), 1 if inside_key != "" else 0], kb.position.x + 16, kb.position.y + 44, 12, Color("#b8c4e8"), HORIZONTAL_ALIGNMENT_LEFT)
	var slots_keys := [
		outside_keys[0] if outside_keys.size() > 0 else "",
		outside_keys[1] if outside_keys.size() > 1 else "",
		inside_key,
	]
	for i in 3:
		if slots_keys[i] != "":
			draw_key(Vector2(kb.position.x + 48 + i * 76, kb.position.y + 72), slots_keys[i])
		else:
			draw_rect(Rect2(kb.position.x + 24 + i * 76, kb.position.y + 60, 52, 24), Color("#505870"), false, 2.0)

	# Footsteps meter
	var vol := footstep_volume()
	var fb := Rect2(VIEW_W / 2 - 170, 10, 340, 50)
	window_box(fb, 0.9)
	text("FOOTSTEPS - HIDE!" if vol > 0 else "Quiet - safe to open a door", VIEW_W / 2, fb.position.y + 24, 13,
		Color("#ffe58a") if vol > 0 else Color("#b8c4e8"))
	shiny_bar(Rect2(fb.position.x + 16, fb.position.y + 31, fb.size.x - 32, 9), vol, Color("#ff4a3a") if vol > 0.75 else Color("#ffd23a"))

	if message_time > 0:
		dialog(VIEW_W / 2 - 300, 120, 600, message, 15)
	var p := van_prompt()
	if p != "":
		dialog(VIEW_W / 2 - 280, VIEW_H - 60, 560, p, 15)


# =====================================================================
# Sound: everything is generated here, no audio files needed
# =====================================================================

const SR := 16000 # sample rate

var sounds := {}
var sfx_players: Array = []
var next_player := 0
var ambience_player := AudioStreamPlayer.new()
var dread_player := AudioStreamPlayer.new()
var current_mood := ""
var spooky_timer := 4.0
var heartbeat_timer := 0.0
var charge_player := AudioStreamPlayer.new()
var sound_queue: Array = [] # sounds still to be made: [name, maker]
var sound_total := 0


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


# Sounds are made a few at a time while the loading screen shows (making them all at once
# froze the browser version of Godot on a grey screen)
func build_sounds() -> void:
	sound_queue = [
		["footstep", func() -> AudioStreamWAV: return make_wav(gen_footstep())],
		["jangle", func() -> AudioStreamWAV: return make_wav(gen_jangle())],
		["heartbeat", func() -> AudioStreamWAV: return make_wav(gen_heartbeat())],
		["sting", func() -> AudioStreamWAV: return make_wav(gen_sting())],
		["pickup", func() -> AudioStreamWAV: return make_wav(gen_pickup())],
		["clunk", func() -> AudioStreamWAV: return make_wav(gen_clunk())],
		["death", func() -> AudioStreamWAV: return make_wav(gen_death())],
		["owl", func() -> AudioStreamWAV: return make_wav(gen_owl())],
		["bell", func() -> AudioStreamWAV: return make_wav(gen_bell())],
		["whisper", func() -> AudioStreamWAV: return make_wav(gen_whisper())],
		["creak", func() -> AudioStreamWAV: return make_wav(gen_creak())],
		["amb1", func() -> AudioStreamWAV: return make_wav(gen_ambience([55.0, 55.25, 58.25], 0.35, 0.5), true)], # forest
		["amb2", func() -> AudioStreamWAV: return make_wav(gen_ambience([49.0, 49.25, 51.75], 0.6, 0.35), true)], # resting of the unstable
		["amb3", func() -> AudioStreamWAV: return make_wav(gen_ambience([44.0, 44.25, 46.5], 0.55, 0.12), true)], # van
		["dread", func() -> AudioStreamWAV: return make_wav(gen_dread(), true)],
		# Shooting and monsters
		["shoot0", func() -> AudioStreamWAV: return make_wav(gen_shoot(0.0))],
		["shoot1", func() -> AudioStreamWAV: return make_wav(gen_shoot(0.5))],
		["shoot2", func() -> AudioStreamWAV: return make_wav(gen_shoot(1.0))],
		["charge_hum", func() -> AudioStreamWAV: return make_wav(gen_charge_hum(), true)],
		["grave_hurt", func() -> AudioStreamWAV: return make_wav(gen_grave_hurt())],
		["lava_throw", func() -> AudioStreamWAV: return make_wav(gen_hiss("band", 300, 1400, 0.35, 0.5))],
		["lava_splat", func() -> AudioStreamWAV: return make_wav(gen_lava_splat())],
		["goblin_hurt", func() -> AudioStreamWAV: return make_wav(gen_tone("saw", 620, 300, 0.16, 0.3, 40.0))],
		["goblin_death", func() -> AudioStreamWAV: return make_wav(gen_goblin_death())],
		["unstable_emerge", func() -> AudioStreamWAV: return make_wav(gen_unstable_emerge())],
		["unstable_hurt", func() -> AudioStreamWAV: return make_wav(gen_unstable_hurt())],
		["unstable_death", func() -> AudioStreamWAV: return make_wav(gen_unstable_death())],
		# New places and monsters
		["amb4", func() -> AudioStreamWAV: return make_wav(gen_ambience([41.0, 41.25, 43.5], 0.6, 0.15), true)], # dark cave
		["amb5", func() -> AudioStreamWAV: return make_wav(gen_ambience([52.0, 52.25, 55.25], 0.45, 0.25), true)], # creepy warehouse
		["amb6", func() -> AudioStreamWAV: return make_wav(gen_ambience([36.0, 36.25, 38.5], 0.3, 0.9), true)], # beach of doom (surf)
		["howl", func() -> AudioStreamWAV: return make_wav(gen_howl())],
		["growl", func() -> AudioStreamWAV: return make_wav(gen_growl())],
		["cackle", func() -> AudioStreamWAV: return make_wav(gen_cackle())],
		["bones", func() -> AudioStreamWAV: return make_wav(gen_bones())],
		["monster_hurt", func() -> AudioStreamWAV: return make_wav(gen_monster_hurt())],
		["monster_death", func() -> AudioStreamWAV: return make_wav(gen_monster_death())],
		["boss_roar", func() -> AudioStreamWAV: return make_wav(gen_boss_roar())],
		["boss_hurt", func() -> AudioStreamWAV: return make_wav(gen_tone("saw", 300, 150, 0.2, 0.35, 25.0))],
		["magic", func() -> AudioStreamWAV: return make_wav(gen_magic())],
		["drip", func() -> AudioStreamWAV: return make_wav(gen_drip())],
		["blip", func() -> AudioStreamWAV: return make_wav(gen_blip())],
		["select", func() -> AudioStreamWAV: return make_wav(gen_select())],
		["heart_break", func() -> AudioStreamWAV: return make_wav(gen_heart_break())],
	]
	sound_total = sound_queue.size()
	for i in 10:
		var p := AudioStreamPlayer.new()
		add_child(p)
		sfx_players.append(p)
	add_child(ambience_player)
	add_child(dread_player)
	add_child(charge_player)


# Make sounds for about 12 milliseconds each frame
func load_some_sounds() -> void:
	var started := Time.get_ticks_msec()
	while not sound_queue.is_empty() and Time.get_ticks_msec() - started < 12:
		var item: Array = sound_queue.pop_front()
		var make: Callable = item[1]
		sounds[item[0]] = make.call()
	if sound_queue.is_empty():
		dread_player.stream = sounds["dread"]
		dread_player.volume_db = -80.0
		dread_player.play()
		charge_player.stream = sounds["charge_hum"]
		charge_player.volume_db = -80.0
		charge_player.play()
		load_slots()
		status = "menu"


func draw_loading() -> void:
	sky(Color("#02030a"), Color("#0b1a2a"))
	title_text("EAP", VIEW_W / 2, 220, 72, Color("#d8ffc8"), INFECTED)
	text("EVAPORATE ALL PARASITES", VIEW_W / 2, 252, 18, Color("#e6e9ef"))
	var done := sound_total - sound_queue.size()
	shiny_bar(Rect2(VIEW_W / 2 - 200, 300, 400, 14), float(done) / maxf(1.0, float(sound_total)), INFECTED)
	text("Making the sounds... %d / %d" % [done, sound_total], VIEW_W / 2, 340, 14, Color("#b8c4e8"))
	text(VERSION, 12, 22, 12, INFECTED, HORIZONTAL_ALIGNMENT_LEFT)

func play_sound(sound_name: String, volume := 1.0, pitch := 1.0) -> void:
	if volume <= 0.01 or not sounds.has(sound_name):
		return
	var p: AudioStreamPlayer = sfx_players[next_player]
	next_player = (next_player + 1) % sfx_players.size()
	p.stream = sounds[sound_name]
	p.volume_db = linear_to_db(volume)
	p.pitch_scale = pitch
	p.play()


const SPOOKY := {
	"amb1": ["owl", "owl", "whisper", "howl"],
	"amb2": ["bell", "whisper", "whisper", "bell"],
	"amb3": ["creak", "creak", "whisper"],
	"amb4": ["drip", "drip", "drip", "whisper"],
	"amb5": ["creak", "whisper", "cackle"],
	"amb6": ["whisper", "bell", "howl"],
}
const MOOD_OF := {"menu": "amb3", "forest": "amb1", "resting": "amb2", "hub": "amb3", "keeper": "amb3", "cave": "amb4", "warehouse": "amb5", "beach": "amb6"}


# Called every frame. dread (0..1) = how close the Keys Keeper is.
func update_audio(scene_key: String, dread: float, delta: float) -> void:
	var mood: String = MOOD_OF.get(scene_key, "amb3")
	if mood != current_mood:
		current_mood = mood
		ambience_player.stream = sounds[mood]
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


# Rising whine while the evaporator charges (power 0 = silent)
func update_charge_hum(power: float) -> void:
	charge_player.volume_db = linear_to_db(maxf(0.0001, (0.25 + power * 0.35) if power > 0 else 0.0))
	charge_player.pitch_scale = 1.0 + power * 3.0


# ---------- sound building blocks for shooting and monsters ----------

func wave(kind: String, phase: float) -> float:
	match kind:
		"square":
			return 1.0 if sin(phase) >= 0 else -1.0
		"saw":
			return fposmod(phase / TAU, 1.0) * 2.0 - 1.0
		"triangle":
			return absf(fposmod(phase / TAU, 1.0) * 4.0 - 2.0) - 1.0
	return sin(phase)


# A tone that slides from f0 to f1 and fades out; vibrato wobbles the pitch (in Hz)
func gen_tone(kind: String, f0: float, f1: float, dur: float, peak: float, vibrato := 0.0) -> PackedFloat32Array:
	var s := samples_for(dur)
	var ph := 0.0
	for i in s.size():
		var t := float(i) / SR
		var f := f0 * pow(f1 / f0, t / dur) + sin(TAU * 28.0 * t) * vibrato
		ph += TAU * f / SR
		var env := minf(t / 0.008, 1.0) * exp(-6.9 * t / dur)
		s[i] = wave(kind, ph) * env * peak
	return s


# Noise through a filter that sweeps from f0 to f1: hisses, whooshes, sizzles, rumbles
func gen_hiss(kind: String, f0: float, f1: float, dur: float, peak: float) -> PackedFloat32Array:
	var s := samples_for(dur)
	var lp := 0.0
	var lp2 := 0.0
	for i in s.size():
		var t := float(i) / SR
		var f := f0 * pow(f1 / f0, t / dur)
		var a := clampf(1.0 - exp(-TAU * f / SR), 0.0, 1.0)
		var n := randf_range(-1, 1)
		lp += (n - lp) * a
		lp2 += (n - lp2) * a * 0.5
		var v := lp
		if kind == "high":
			v = n - lp
		elif kind == "band":
			v = (lp - lp2) * 2.0
		var env := minf(t / minf(0.05, dur / 4.0), 1.0) * exp(-6.9 * t / dur)
		s[i] = v * env * peak
	return s


# Add `src` into `dst`, starting `delay` seconds in
func mix_into(dst: PackedFloat32Array, src: PackedFloat32Array, delay := 0.0) -> PackedFloat32Array:
	var start := int(delay * SR)
	if dst.size() < start + src.size():
		dst.resize(start + src.size())
	for i in src.size():
		dst[start + i] += src[i]
	return dst


func gen_shoot(power: float) -> PackedFloat32Array:
	var s := gen_tone("square", 1400 - power * 700, 260 - power * 140, 0.14 + power * 0.25, 0.3 + power * 0.15)
	s = mix_into(s, gen_tone("saw", 900 - power * 400, 120, 0.12 + power * 0.3, 0.2 + power * 0.12))
	if power > 0.2:
		s = mix_into(s, gen_hiss("high", 3000, 800, 0.2 + power * 0.3, 0.4 * power))
	return s


# One-second loop (220 Hz with an 18 Hz wobble); pitch_scale raises it while charging
func gen_charge_hum() -> PackedFloat32Array:
	var s := samples_for(1.0)
	var ph := 0.0
	for i in s.size():
		var t := float(i) / SR
		ph += TAU * (220.0 + sin(TAU * 18.0 * t) * 6.0) / SR
		s[i] = wave("triangle", ph) * 0.25
	return s


func gen_grave_hurt() -> PackedFloat32Array:
	return mix_into(gen_tone("saw", 190, 110, 0.18, 0.35), gen_hiss("low", 900, 300, 0.12, 0.5))


func gen_lava_splat() -> PackedFloat32Array:
	return mix_into(gen_tone("sine", 120, 50, 0.18, 0.7), gen_hiss("high", 4000, 1500, 0.5, 0.5), 0.02)


func gen_goblin_death() -> PackedFloat32Array:
	var s := gen_tone("saw", 700, 70, 1.1, 0.35, 60.0) # long falling screech
	s = mix_into(s, gen_tone("square", 350, 40, 1.0, 0.15), 0.05)
	return mix_into(s, gen_hiss("high", 2500, 600, 1.6, 0.6), 0.1) # evaporating steam


func gen_unstable_emerge() -> PackedFloat32Array:
	return mix_into(gen_hiss("low", 180, 60, 0.6, 1.0), gen_hiss("band", 1800, 600, 0.12, 0.6), 0.25)


# Glitchy blip: three quick random pitch jumps
func gen_unstable_hurt() -> PackedFloat32Array:
	var s := PackedFloat32Array()
	for k in 3:
		var f := randf_range(300, 1200)
		s = mix_into(s, gen_tone("square", f, f * 0.9, 0.04, 0.15), k * 0.035)
	return s


func gen_unstable_death() -> PackedFloat32Array:
	var s := gen_tone("sine", 520, 90, 0.7, 0.4, 90.0) # warbling dissolve
	s = mix_into(s, gen_tone("square", 1200, 300, 0.25, 0.1), 0.05)
	return mix_into(s, gen_hiss("high", 3500, 900, 0.8, 0.45), 0.05) # fizz


# ---------- sounds for the new places and monsters ----------

# Wolf howl: a rising and falling wail
func gen_howl() -> PackedFloat32Array:
	var s := samples_for(1.6)
	var ph := 0.0
	for i in s.size():
		var t := float(i) / SR
		var f := 380.0 + 300.0 * sin(PI * minf(t / 1.4, 1.0)) + sin(TAU * 5.0 * t) * 8.0
		ph += TAU * f / SR
		var env := minf(t / 0.2, 1.0) * clampf((1.6 - t) / 0.5, 0.0, 1.0)
		s[i] = (sin(ph) + 0.3 * sin(ph * 2.0)) * env * 0.22
	return s


func gen_growl() -> PackedFloat32Array:
	return mix_into(gen_tone("saw", 110, 70, 0.7, 0.3, 12.0), gen_hiss("low", 400, 150, 0.6, 0.5))


# Witch cackle: quick falling "heh-heh-heh"
func gen_cackle() -> PackedFloat32Array:
	var s := PackedFloat32Array()
	for k in 5:
		s = mix_into(s, gen_tone("saw", 900 - k * 60, 600 - k * 40, 0.09, 0.18, 30.0), k * 0.11)
	return s


# Skeleton falling apart: a clatter of bones
func gen_bones() -> PackedFloat32Array:
	var s := PackedFloat32Array()
	for k in 7:
		s = mix_into(s, gen_hiss("band", 2600 - k * 150, 1400, 0.05, 0.6), k * 0.06 + randf() * 0.03)
	return s


# Shared by most monsters; play_sound's pitch makes each kind sound different
func gen_monster_hurt() -> PackedFloat32Array:
	return gen_tone("saw", 520, 260, 0.14, 0.28, 30.0)


func gen_monster_death() -> PackedFloat32Array:
	return mix_into(gen_tone("saw", 440, 70, 0.5, 0.28, 40.0), gen_hiss("high", 3000, 800, 0.6, 0.4), 0.05)


func gen_boss_roar() -> PackedFloat32Array:
	var s := gen_tone("saw", 140, 60, 1.4, 0.4, 18.0)
	s = mix_into(s, gen_tone("square", 70, 40, 1.3, 0.2))
	return mix_into(s, gen_hiss("low", 800, 200, 1.2, 0.5))


func gen_magic() -> PackedFloat32Array:
	var s := PackedFloat32Array()
	for k in 3:
		s = mix_into(s, gen_tone("square", 900 + k * 300, 1800 + k * 300, 0.08, 0.12), k * 0.04)
	return s


# Water dripping in the cave, with an echo
func gen_drip() -> PackedFloat32Array:
	return mix_into(gen_tone("sine", 1500, 700, 0.12, 0.35), gen_tone("sine", 1500, 700, 0.12, 0.12), 0.25)


# ---------- 32-bit style screens and infected monsters ----------

const WIN_TOP := Color("#2b3f9e")


const WIN_BOTTOM := Color("#0a1238")


const WIN_EDGE := Color("#dfe6f5")


const POINTER := Color("#ffd23a")


func text_width(s: String, size: int) -> float:
	return ThemeDB.fallback_font.get_string_size(s, HORIZONTAL_ALIGNMENT_LEFT, -1, size).x


# Big title text: shadow, then a top-to-bottom two-colour shine
func title_text(s: String, x: float, y: float, size: int, top: Color, bottom: Color) -> void:
	text(s, x, y, size, bottom)
	var font := ThemeDB.fallback_font
	var left := x - text_width(s, size) / 2.0
	# A lighter copy nudged up gives the letters a shine
	draw_string(font, Vector2(left, y - size * 0.06), s, HORIZONTAL_ALIGNMENT_LEFT, -1, size, Color(top, top.a * 0.55))


# A gradient window with a silver border
func window_box(r: Rect2, alpha := 0.95) -> void:
	draw_polygon(
		PackedVector2Array([r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y)]),
		PackedColorArray([Color(WIN_TOP, alpha), Color(WIN_TOP, alpha), Color(WIN_BOTTOM, alpha), Color(WIN_BOTTOM, alpha)]))
	draw_rect(r.grow(-1.0), Color(0.05, 0.05, 0.12, alpha), false, 2.0)
	draw_rect(r.grow(-3.0), WIN_EDGE, false, 2.0)
	draw_line(r.position + Vector2(5, 5), Vector2(r.end.x - 5, r.position.y + 5), Color(1, 1, 1, 0.35), 1.0) # top shine


# Shiny bar: dark back, fill, a highlight along the top and a shade along the bottom
func shiny_bar(r: Rect2, frac: float, fill: Color, back := Color("#141428")) -> void:
	draw_rect(r.grow(1.0), Color(0, 0, 0, 0.8))
	draw_rect(r, back)
	var w := r.size.x * clampf(frac, 0.0, 1.0)
	if w > 0:
		draw_rect(Rect2(r.position, Vector2(w, r.size.y)), fill)
		draw_rect(Rect2(r.position, Vector2(w, maxf(1.0, r.size.y * 0.3))), fill.lightened(0.45))
		draw_rect(Rect2(r.position.x, r.end.y - maxf(1.0, r.size.y * 0.25), w, maxf(1.0, r.size.y * 0.25)), fill.darkened(0.35))
	draw_rect(r, Color(1, 1, 1, 0.25), false, 1.0)


# Golden menu pointer, bobbing a little
func draw_pointer(tip: Vector2, size := 12.0) -> void:
	var bob := sin(now() * 6.0) * 2.0
	var t := tip + Vector2(bob, 0)
	draw_colored_polygon(PackedVector2Array([t + Vector2(2, 2), t + Vector2(-size + 2, -size * 0.6 + 2), t + Vector2(-size + 2, size * 0.6 + 2)]), Color(0, 0, 0, 0.6))
	draw_colored_polygon(PackedVector2Array([t, t + Vector2(-size, -size * 0.6), t + Vector2(-size, size * 0.6)]), POINTER)
	draw_colored_polygon(PackedVector2Array([t, t + Vector2(-size, -size * 0.6), t + Vector2(-size * 0.5, 0)]), POINTER.lightened(0.5))


func wrap_text(s: String, size: int, max_width: float) -> PackedStringArray:
	var out := PackedStringArray()
	var line := ""
	for word in s.split(" "):
		var attempt := word if line == "" else line + " " + word
		if line != "" and text_width(attempt, size) > max_width:
			out.append(line)
			line = word
		else:
			line = attempt
	if line != "":
		out.append(line)
	return out


# A message window whose text types itself out (reveal = how many letters to show)
func dialog(x: float, y: float, w: float, s: String, size: int, reveal := 100000, color := Color.WHITE) -> void:
	var lines := wrap_text(s, size, w - 40)
	var line_h := size * 1.35
	window_box(Rect2(x, y, w, 22 + lines.size() * line_h))
	var shown := reveal
	var ty := y + 11 + size
	for line in lines:
		if shown <= 0:
			break
		text(line.substr(0, shown), x + 20, ty, size, color, HORIZONTAL_ALIGNMENT_LEFT)
		shown -= line.length() + 1
		ty += line_h


# Letters shown so far for text that types itself out
func typed_letters(delay := 0.0) -> int:
	return maxi(0, int((status_time - delay) * 40.0))


# The text the current story screen is typing out (for the blip sounds)
func current_dialog() -> String:
	match status:
		"title":
			return title_line()
		"lost":
			if scene == "keeper":
				return death_reason + " Don't give up! Press R to try again."
			return "Grave... the parasite virus got you this time. Don't give up! Press R to try again from the van."
		"won":
			return "Grave escaped the van! The parasites aren't finished yet... To be continued. Press R for the save files."
	return ""


func title_line() -> String:
	if PLACES.has(next_scene):
		return PLACES[next_scene]["line"] + " " + place_goal(next_scene)
	match next_scene:
		"hub":
			return "The EAP van. Walk up to the map on the wall to choose where to go."
		"keeper":
			return "*click* ... The van doors lock from the outside. Somebody is jingling keys."
	return ""


func level_number() -> int:
	var cleared: Array = progress["cleared"]
	return cleared.size() + 1


# Some sounds (howls, cackles...) would pile up with many monsters, so they wait a little between plays
func play_limited(sound_name: String, gap: float, volume := 1.0, pitch := 1.0) -> void:
	var t := now()
	if t < float(sound_next.get(sound_name, 0.0)):
		return
	sound_next[sound_name] = t + gap
	play_sound(sound_name, volume, pitch)


# A glowing green eye: the sign of the parasite virus
func infected_eye(c: Vector2, r: float) -> void:
	glow(c, r * 1.6, INFECTED, 0.25)
	draw_rect(Rect2(c.x - r, c.y - r, r * 2, r * 2), INFECTED)


func gen_blip() -> PackedFloat32Array:
	return gen_tone("square", 520, 500, 0.035, 0.16)


func gen_select() -> PackedFloat32Array:
	return mix_into(gen_tone("square", 660, 660, 0.07, 0.2), gen_tone("square", 990, 990, 0.09, 0.2), 0.06)


func gen_heart_break() -> PackedFloat32Array:
	return mix_into(gen_hiss("band", 2400, 900, 0.15, 0.8), gen_tone("square", 220, 110, 0.35, 0.25), 0.05)
