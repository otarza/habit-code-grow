---
title: "დავალება 4.3 Adieu, Adieu"
order: 2603
videoUrl: ""
videoDuration: ""
isPreview: false
---

### უყურეთ ვიდეოს

 
 

{% youtube "https://www.youtube.com/embed/Qy9_lfjQopU?controls=0&wmode=transparent&rel=0&showinfo=0&enablejsapi=1&modestbranding=1&cc_load_policy=0&html5=1&origin=https%3A%2F%2Fstudio.edx.bitcamp.ge&widgetid=1" %}

[The Sound of Music](https://en.wikipedia.org/wiki/The_Sound_of_Music_(film)) - ში არის ერთი სიმღერა, ძირითადად ინგლისური - [So Long, Farewell](https://www.youtube.com/watch?v=Qy9_lfjQopU) ასეთი [ტექსტით](https://www.lyrics.com/lyric/3998488/Julie+Andrews/So+Long%2C+Farewell) სადაც "adieu" ნიშნავს "goodbye" - ს ფრანგულად:

**Adieu, adieu, to yieu and yieu and yieu

რა თქმა უნდა ეს ტექსტი არ არის გრამატიკულად გამართული, ასე რომ იყოს [Oxford comma](https://en.wikipedia.org/wiki/Serial_comma) - ს მიხედვით იქნებოდა ჩაწერილი:

> Adieu, adieu, to yieu, yieu, and yieu
> 
> 

სიმართლე ვთქვათ და "yieu" საერთოდ არ არსებული სიტყვაა. უბრალოდ კარგად ერითმება "you" - ს.

**

დავალება**

ფაილში სახელად adieu.py შექმენი პროგრამა რომელიც მომხმარებელს სთხოვს სახელების შეყვანას თითო ხაზზე მანამ სანამ მომხმარებელი control-d - ს არ აკრეფს (გაიხსენეთ წინა თავიდან). ჩათვალე რომ მომხმარებელი შეიყვანს მინიმუმ 1 სახელს მაინც. შემდეგ კი ჩასვით "adieu ფორმატში" - სადაც 2 სახელი გამოიყოფა and - ის საშუალებით. 3 სახელი გამოიყოფა 2 მძიმისა და 1 and - ის საშუალებიათ. n სახელი გამოიყოფა n - 1 მძიმისა და 1 and - ის საშუალებით. 

ისე როგორც მოცემულია ქვემოთ: 

> Adieu, adieu, to Liesl
> 
> Adieu, adieu, to Liesl and Friedrich
> 
> Adieu, adieu, to Liesl, Friedrich, and Louisa
> 
> Adieu, adieu, to Liesl, Friedrich, Louisa, and Kurt
> 
> Adieu, adieu, to Liesl, Friedrich, Louisa, Kurt, and Brigitta
> 
> Adieu, adieu, to Liesl, Friedrich, Louisa, Kurt, Brigitta, and Marta
> 
> Adieu, adieu, to Liesl, Friedrich, Louisa, Kurt, Brigitta, Marta, and Gretl
> 
> 

მინიშნებები:**

- გაითვალისწინე რომ inflect მოდულს საინტერესო მეთოდები აქვს [https://pypi.org/project/inflect/](https://pypi.org/project/inflect/) და მისი დაინსტალირება შეგიძლია ასე:
`pip install inflect`

#### სანამ დაიწყებ

1. Terminal - ში გაუშვი ბრძანება `cd` - ამ ბრძანების გაშვებით თავს დაიზღვევ რომ ნამდვილად შენს მთავარ ფოლდერში ხარ. 
2. შემდეგ ისევ Terminal - ში გაუშვი ბრძანება `mkdir adieu` - ამ ბრძანებით შექმნი ახალ ფოლდერს სახელად adieu შენი დავალებისთვის.
3. შემდეგ გაუშვი `cd adieu` - ამ ბრძანებით შეხვალ შენს მიერ შექმნილ adieu ფოლდერში. 

4. ახლა ამ ფოლდერში შექმენი ფაილი სახელად `adieu.py`- ამ ბრძანების გამოყენებით `code adieu.py`
5. დაიწყე დავალების შესრულება `adieu.py` ფაილში.

 

#### Demo - როგორ უნდა მუშაობდეს შენი პროგრამა?

{% embed "https://asciinema.org/a/CGpjIC37tn6y3K5fT0wxoUstN/iframe?autoplay=1&cols=80&loop=1&rows=12" %}

#### როგორ უნდა გატესტო შენი პროგრამა?

როდესაც ჩათვლი რომ შედეგს მიაღწიე და გინდა დარწმუნდე რომ შენი პროგრამა სწორად მუშაობს, შეგიძლია გატესტო რამდენიმე გზით. 

##### გატესტე ხელით

- გაუშვი შენი პროგრამა python adieu.py. შეიყვანე Liesl  და დააჭირე Enter - ს და შემდეგ control-d - ს. პროგრამამ უნდა გამობეჭდოს:
`Adieu, adieu, to Liesl`
- გაუშვი შენი პროგრამა python adieu.py. შეიყვანე Liesl  და დააჭირე Enter - ს. შეიყვანე Friedrich და დააჭირე Enter - ს და შემდეგ control-d - ს. პროგრამამ უნდა გამობეჭდოს:
```
Adieu, adieu, to Liesl and Friedrich
```

- გაუშვი შენი პროგრამა python adieu.py. შეიყვანე Liesl  და დააჭირე Enter - ს. შეიყვანე Friedrich და დააჭირე Enter - ს. შეიყვანე Louisa და დააჭირე Enter - ს და შემდეგ control-d - ს. პროგრამამ უნდა გამობეჭდოს:
```
Adieu, adieu, to Liesl, Friedrich, and Louisa
```

##### ავტომატური გატესტვა - check50

მას შემდეგ რაც ხელით გატესტავ და ჩათვლი რომ შენი პროგრამა სავარაუდოდ სწორად მუშაობს, შეგიძლია ავტომატური ტესტირების სისტემაც გამოიყენო. 

ამისათვის Terminal - ში გაუშვი ასეთი ბრძანება 

```bash
check50 cs50/problems/2022/python/adieu
```

მწვანე სმაილები ნიშნავს რომ შენმა პროგრამამ გაიარა ტესტი. 

წითელი მოწყენილი სახეები ნიშნავს რომ შენმა პროგრამამ კონკრეტულ შემთხვევებში არასწორად იმუშავა და იმ შემთხვევების შესაბამისად უნდა გამოასწორო მანამ სანამ მწვანე სმაილს არ მიიღებ.

check50 ასევე დაგიბრუნებს მისამართს რომელსაც შეგიძლია ეწვიო და ნახო ზუსტად რა მნიშვნელობებზე გაიტესტა შენი პროგრამა.

##### როგორ გავაგზავნოთ ნამუშევარი Harvard - ის სისტემაში?

მას შემდეგ რაც ხელით და ავტომატური გატესტვავ და დარწმუნდები რომ ყველაფერი რიგზეა, submit50 - ბრძანების გამოყენებით შეგიძლია გააგზავნო შენი ნამუშევარი Harvard - ის სისტემაში.

ზუსტი ბრძანება ასე გამოიყურება: 

```bash
submit50 cs50/problems/2022/python/adieu
```

სწავლა და ბრძოლა