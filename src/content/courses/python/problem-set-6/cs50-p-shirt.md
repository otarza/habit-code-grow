---
title: "დავალება 6.4 CS50 P-Shirt"
order: 3104
videoUrl: ""
videoDuration: ""
isPreview: false
---

![](../../../media/external/images/took-bdc9200a.png)

უნივერსიტეტები თუ სხვადასხვა ორგანიზაციები ხშირად იყენებენ ბრენდირებულ მაისურებს. მათ შორის ჰარვარდში პოპულარულია "I took CS50" / "მე გავიარე CS50" მაისურები.

### **დავალება**

შექმენი პროგრამა სახელად shirt.py რომელსაც გადასცემ 2 command-line არგუმენტს:

- პირველ პარამეტრად sys.argv[1] - ში უნდა მოხვდეს იმ სურათის სახელი რომელიც გვინდა რომ გავხსნათ (input).
- მეორე პარამეტრად sys.argv[2] - ში უნდა მოხვდეს ფაილის სახელი რომელიც უნდა შევქმნათ/შევინახოთ პროგრამის მუშაობის შედეგად (output).

შენმა პროგრამამ უნდა აიღოს პირველ არგუმენტად შეყვანილი ფაილი და მას დაადოს [shirt.png](https://cs50.harvard.edu/python/2022/psets/6/shirt/shirt.png)(გადმოწერე) მაისურის სურათი - შედეგად უნდა მივიღოთ რომ საწყის სურათში მყოფ თოჯინას უნდა "ეცვას" ეს მაისური.

- გახსენი სურათი Image.Open - ის გამოყენებით - [https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.open](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.open)
- resize და crop სურათი ImageOps.fit. - ის გამოყენებით - [https://pillow.readthedocs.io/en/stable/reference/ImageOps.html#PIL.ImageOps.fit](https://pillow.readthedocs.io/en/stable/reference/ImageOps.html#PIL.ImageOps.fit) - გამოიყენე default მნიშვნელობები method, bleed და centering - სთვის.
- დაადე მაისურის სურათი Image.paste - ის გამოყენებით - [https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image.paste](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image.paste)
- და შეინახე შედეგი Image.save - ის გამოყენებით - [https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image.save](https://pillow.readthedocs.io/en/stable/reference/Image.html#PIL.Image.Image.save)

შენმა პროგრამამ უნდა დაასრულოს მუშაობა sys.exit - ით თუ:

- მომხმარებელი არ შეიყვანს ზუსტად 2 command-line არგუმენტს;
- თუ შეყვანილი ფაილების სახელები არ ბოლოვდება შემდეგი ფორმატებით  .jpg, .jpeg ან .png (დიდ-პატარა ასოებს არ აქვს მნიშვნელობ).
- თუ პირველ არგუმენტს და მეორე არგუმენტს არ აქვთ ერთნაირი გაფართოებები. 
-  

### **

მინიშნებები:**

- გაიხსენე რომ [csv](https://studio.edx.bitcamp.ge/container/docs.python.org/3/library/csv.html) - მოდულს ბევრი სასარგებლო მეთოდი აქვს აქვს, მათ შორის reader - [https://docs.python.org/3/library/csv.html#csv.reader](https://docs.python.org/3/library/csv.html#csv.reader) და [DictReader](https://docs.python.org/3/library/csv.html#csv.DictReader)
- გაითვალისწინე რომ open - ს შეუძლია გამოიწვიოს(raise) შემდეგი ექსეფშენი - FileNotFoundError - დოკუმენტაციის მიხედვით: [https://docs.python.org/3/library/exceptions.html#FileNotFoundError](https://docs.python.org/3/library/exceptions.html#FileNotFoundError)
- გაითვალისწინე რომ tabulate მოდულს მხოლოდ 1 ფუნქცია აქვს და მისი დაყენება შეიძლება ამ ბრძანებით:
`pip install tabulate`

#### სანამ დაიწყებ

1. Terminal - ში გაუშვი ბრძანება `cd` - ამ ბრძანების გაშვებით თავს დაიზღვევ რომ ნამდვილად შენს მთავარ ფოლდერში ხარ. 
2. შემდეგ ისევ Terminal - ში გაუშვი ბრძანება `mkdir pizza` - ამ ბრძანებით შექმნი ახალ ფოლდერს სახელად pizza შენი დავალებისთვის.
3. შემდეგ გაუშვი `cd pizza` - ამ ბრძანებით შეხვალ შენს მიერ შექმნილ pizza ფოლდერში. 

4. ახლა ამ ფოლდერში შექმენი ფაილი სახელად pizza`.py `- ამ ბრძანების გამოყენებით `code pizza.py`
5. დაიწყე დავალების შესრულება pizza`.py ` ფაილში.

#### როგორ უნდა გატესტო შენი პროგრამა?

როდესაც ჩათვლი რომ შედეგს მიაღწიე და გინდა დარწმუნდე რომ შენი პროგრამა სწორად მუშაობს, შეგიძლია გატესტო რამდენიმე გზით. 

##### გატესტე ხელით

- გაუშვი პროგრამა ბრძანებით python pizza.py. პროგრამამ უნდა დაასრულოს მუშაობა მაშინვე sys.exit - ით და დაგიწეროს:
`Too few command-line arguments`
- გადმოწერე [regular.csv](https://cs50.harvard.edu/python/2022/psets/6/pizza/regular.csv) და [sicilian.csv](https://cs50.harvard.edu/python/2022/psets/6/pizza/sicilian.csv) ფაილები და ჩაამატე ისინი შენს pizza.py - სთან ერთად. გაუშვი შენი პროგრამა და გადაეცი პარამეტრად ორივეს დასახელება python pizza.py regular.csv sicilian.csv და შედეგად შენი პროგრამა უნდა დასრულდეს sys.exit - ით და შესაბამისი მესიჯით: 
```
Too many command-line arguments
```

- გაუშვი შენი პროგრამა ბრძანებით python pizza.py invalid_file.csv - ვგულისხმობთ რომ invalid_file.csv არ არსებობს. შედეგად პროგრამამ უნდა დაასრულოს მუშაობა sys.exit - ით და შესაბამისი მესიჯით:
```
File does not exist
```

- შექმენი ფაილი sicilian.txt და გაუშვი შენი პროგრამა ბრძანებით python pizza.py sicilian.txt - შედეგად პროგრამა უნდა დასრულდეს sys.exit - ით და შესაბამისი მესიჯით:
```
Not a CSV file
```

- გაუშვი შენი პროგრამა ბრძანებით python pizza.py regular.csv (ვგულისხმობთ რომ regular.csv უკვე გადმოწერე). შედეგად უნდა მიიღო: 
```
+-----------------+---------+---------+
| Regular Pizza   | Small   | Large   |
+=================+=========+=========+
| Cheese          | $13.50  | $18.95  |
+-----------------+---------+---------+
| 1 topping       | $14.75  | $20.95  |
+-----------------+---------+---------+
| 2 toppings      | $15.95  | $22.95  |
+-----------------+---------+---------+
| 3 toppings      | $16.95  | $24.95  |
+-----------------+---------+---------+
| Special         | $18.50  | $26.95  |
+-----------------+---------+---------+
```

##### Demo

{% embed "https://asciinema.org/a/3nNF1eXtVr4mZOTzhxtpV94pp/iframe?autoplay=1&cols=80&loop=1&rows=16" %}

 

##### ავტომატური გატესტვა - check50

მას შემდეგ რაც ხელით გატესტავ და ჩათვლი რომ შენი პროგრამა სავარაუდოდ სწორად მუშაობს, შეგიძლია ავტომატური ტესტირების სისტემაც გამოიყენო. 

ამისათვის Terminal - ში გაუშვი ასეთი ბრძანება `check50 cs50/problems/2022/python/pizza`

მწვანე სმაილები ნიშნავს რომ შენმა პროგრამამ გაიარა ტესტი. 

წითელი მოწყენილი სახეები ნიშნავს რომ შენმა პროგრამამ კონკრეტულ შემთხვევებში არასწორად იმუშავა და იმ შემთხვევების შესაბამისად უნდა გამოასწორო მანამ სანამ მწვანე სმაილს არ მიიღებ.

check50 ასევე დაგიბრუნებს მისამართს რომელსაც შეგიძლია ეწვიო და ნახო ზუსტად რა მნიშვნელობებზე გაიტესტა შენი პროგრამა.

##### როგორ გავაგზავნოთ ნამუშევარი Harvard - ის სისტემაში?

მას შემდეგ რაც ხელით და ავტომატური გატესტვავ და დარწმუნდები რომ ყველაფერი რიგზეა, submit50 - ბრძანების გამოყენებით შეგიძლია გააგზავნო შენი ნამუშევარი Harvard - ის სისტემაში.

ზუსტი ბრძანება ასე გამოიყურება: `submit50 cs50/problems/2022/python`/pizza

სწავლა და ბრძოლა

1.