---
title: "დავალება 4.6 Bitcoin - ის ფასის ინდექსი | Bitcoin Price Index"
order: 2706
videoUrl: ""
videoDuration: ""
isPreview: false
---

![](../../../media/external/images/bitcoin-53e4977a.png)

[Bitcoin](https://en.wikipedia.org/wiki/Bitcoin) - ი ციფრული ვალუტის ერთ-ერთი ფორმაა, ასევე ცნობილი როგორც [კრიპტოვალუტა](https://en.wikipedia.org/wiki/Cryptocurrency). ის სხვა (fiat) ვალუტებისგან იმით განსხვავდება რომ ცენტრალური ავტორიტეტის (ცენტრალური ბანკის, მთავრობების) მიერ არ არის მოწოდებული ან მართული და ეფუძნება დისტრიბუციულ ქსელს - ცნობილია როგოროც [blockchain](https://en.wikipedia.org/wiki/Blockchain). 

რადგან Bitcoin - ზე მოთხოვნა მაღალია (ბევრ ადამიანს სურს მისი ფლობა), მომხმარებლები მზად არიან გაცვალონ და შეიძინონ ის fiat ვალუტის სანაცვლოდ (ლარი, დოლარი, ევრო და ა.შ.).

**დავალება**

ფაილში სახელად bitcoin.py შექმენი პროგრამა:

- რომელიც მომხმარებელისგან ელოდება command-line არგუმენტს - n - ს, Bitcoin - ის რაოდენობას. თუ შეყვანილი მნიშვნელობის გადაკონვერტირება ვერ მოხდება float - ში, მაშინ პროგრამა უნდა გაჩერდეს sys.exit - ის გამოყენებით.
- რომელიც მიმართავს CoinCap-ის API-ს ბიტკოინის მიმდინარე ფასის მისაღებად მისამართზე: https://rest.coincap.io/v3/assets/bitcoin?apiKey=YourApiKey. ბოლოში YourApiKey შეიცვალეთ იმ API გასაღებით, რომელიც მიიღეთ თქვენი CoinCap-ის ანგარიშის დეშბორდიდან. ეს API აბრუნებს [JSON](https://en.wikipedia.org/wiki/JSON) ობიექტს რომლის ჩალაგებულ სტრუქტურაში იპოვით Bitcoin - ის ფასს float ფორმატში. 
requests - მოდულის გამოყენებისას დარწმუნდი რომ [exception](https://requests.readthedocs.io/en/latest/api/#exceptions) - ებსაც მართავ.
`import requests

try:
    ...
except requests.RequestException:
    ...`
- პროგრამამ საბოლოოდ უნდა გამოიტანოს შეყვანილი n Bitcoin - ის ფასი დოლარში. მძიმის შემდეგ 4 ციფრის სიზუსტით. 

**

მინიშნებები:**

- გაიხსენე რომ sys მოდულს აქვს argv - დოკუმენტაცია: [https://docs.python.org/3/library/sys.html#sys.argv](https://docs.python.org/3/library/sys.html#sys.argv)
- ასევე გაიხსენე რომ requests მოდულს გამოსადეგი მეთოდები აქვს - დოკუმენტაცია: [https://requests.readthedocs.io/en/latest/](https://requests.readthedocs.io/en/latest/). მათ შორისაა get მეთოდიც რომლის გამოყენების მაგალითს აქ ნახავ: [https://requests.readthedocs.io/en/latest/user/quickstart.html#make-a-request](https://requests.readthedocs.io/en/latest/user/quickstart.html#make-a-request) და json მეთოდიც რომლის გამოყენების მაგალითიც აქ არის: [https://requests.readthedocs.io/en/latest/user/quickstart.html#json-response-content](https://requests.readthedocs.io/en/latest/user/quickstart.html#json-response-content)
რაც მთავარია, ამ მოდულის დაყენებას შეძლებ ასე: 
`pip install requests`
- გაითვალისწინე რომ CoinDesk - ის API აბრუნებს ასეთ JSON პასუხს/response:
```
{
   "time":{
      "updated":"May 2, 2022 15:27:00 UTC",
      "updatedISO":"2022-05-02T15:27:00+00:00",
      "updateduk":"May 2, 2022 at 16:27 BST"
   },
   "disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org",
   "chartName":"Bitcoin",
   "bpi":{
      "USD":{
         "code":"USD",
         "symbol":"$",
         "rate":"38,761.0833",
         "description":"United States Dollar",
         "rate_float":38761.0833
      },
      "GBP":{
         "code":"GBP",
         "symbol":"&pound;",
         "rate":"30,827.6198",
         "description":"British Pound Sterling",
         "rate_float":30827.6198
      },
      "EUR":{
         "code":"EUR",
         "symbol":"&euro;",
         "rate":"36,800.2764",
         "description":"Euro",
         "rate_float":36800.2764
      }
   }
}
```

- ასევე გახსოვდეს რომ შეგიძლია დოლარის შესაბამისი რიცხვითი შედეგის ფორმატირება მძიმის შემდეგ 4 რიცხვამდე ასეთი კოდის გამოყენებით:
```
print(f"${amount:,.4f}")
```

- ერთი შეხედვით ძნელ დავალებას გავს, თუმცა სირთულე იმაშია რომ ბევრი დეტალისგან შედგება და თითოეული დეტალი ცალ-ცალკე საკმაოდ მარტივია. ამიტომ ეცადე არ დაიბნე, დაყავი შენი დავალება პატარ-პატარა, მარტივად აღსაქმელ პრობლემებად და ეცადე მხოლოდ პატარა პრობლემები მოაგვარო. არ ეცადო მთელი დავალების ერთიანად შესრულებას. გახსოვდეს რომ წარმატებული პროგრამისტი არ არის გენიოსი და ყველაფრის ერთიანად გააზრება არავის შეუძლია. წარმატებული პროგრამისტი ისაა ვინც დიდი პრობლემის პატარა ნაწილებად დაყოფას სწავლობს და შემდეგ ნებისყოფას ივარჯიშებს რომ ბევრი პატარა ნაწილი, ნელ-ნელა და მოთმინებით გადალახოს. 

#### სანამ დაიწყებ

1. Terminal - ში გაუშვი ბრძანება `cd` - ამ ბრძანების გაშვებით თავს დაიზღვევ რომ ნამდვილად შენს მთავარ ფოლდერში ხარ. 
2. შემდეგ ისევ Terminal - ში გაუშვი ბრძანება `mkdir bitcoin` - ამ ბრძანებით შექმნი ახალ ფოლდერს სახელად bitcoin შენი დავალებისთვის.
3. შემდეგ გაუშვი `cd bitcoin` - ამ ბრძანებით შეხვალ შენს მიერ შექმნილ bitcoin ფოლდერში. 

4. ახლა ამ ფოლდერში შექმენი ფაილი სახელად `bitcoin.py`- ამ ბრძანების გამოყენებით `code bitcoin.py`
5. დაიწყე დავალების შესრულება `bitcoin.py` ფაილში.

 

#### Demo - როგორ უნდა მუშაობდეს შენი პროგრამა?

{% embed "https://asciinema.org/a/CDEoYDHQacpYQs6wZYbQlUNwy/iframe?autoplay=1&cols=80&loop=1&rows=12" %}

#### როგორ უნდა გატესტო შენი პროგრამა?

როდესაც ჩათვლი რომ შედეგს მიაღწიე და გინდა დარწმუნდე რომ შენი პროგრამა სწორად მუშაობს, შეგიძლია გატესტო რამდენიმე გზით. 

##### გატესტე ხელით

- გაუშვი შენი პროგრამა python bitcoin.py. შენმა პროგრამამ უნდა გამოიყენოს sys.exit და დაასრულოს მუშაობა მესიჯით:
`Missing command-line argument`
- გაუშვი შენი პროგრამა python bitcoin.py cat. შენმა პროგრამამ უნდა გამოიყენოს sys.exit და დაასრულოს მუშაობა მესიჯით:
```
Command-line argument is not a number
```

- გაუშვი შენი პროგრამა python bitcoin.py 1. შენმა პროგრამამ უნდა გამოიტანოს 1 ბიტკოინის ფასი, მძიმის შემდეგ 4 ციფრის სიზუსტით.
- გაუშვი შენი პროგრამა python bitcoin.py 2. შენმა პროგრამამ უნდა გამოიტანოს 2 ბიტკოინის ფასი, მძიმის შემდეგ 4 ციფრის სიზუსტით.
- გაუშვი შენი პროგრამა python bitcoin.py 2.5. შენმა პროგრამამ უნდა გამოიტანოს 2.5 ბიტკოინის ფასი, მძიმის შემდეგ 4 ციფრის სიზუსტით.

##### ავტომატური გატესტვა - check50

მას შემდეგ რაც ხელით გატესტავ და ჩათვლი რომ შენი პროგრამა სავარაუდოდ სწორად მუშაობს, შეგიძლია ავტომატური ტესტირების სისტემაც გამოიყენო. 

ამისათვის Terminal - ში გაუშვი ასეთი ბრძანება 

```bash
check50 cs50/problems/2022/python/bitcoin
```

მწვანე სმაილები ნიშნავს რომ შენმა პროგრამამ გაიარა ტესტი. 

წითელი მოწყენილი სახეები ნიშნავს რომ შენმა პროგრამამ კონკრეტულ შემთხვევებში არასწორად იმუშავა და იმ შემთხვევების შესაბამისად უნდა გამოასწორო მანამ სანამ მწვანე სმაილს არ მიიღებ.

check50 ასევე დაგიბრუნებს მისამართს რომელსაც შეგიძლია ეწვიო და ნახო ზუსტად რა მნიშვნელობებზე გაიტესტა შენი პროგრამა.

##### როგორ გავაგზავნოთ ნამუშევარი Harvard - ის სისტემაში?

მას შემდეგ რაც ხელით და ავტომატური გატესტვავ და დარწმუნდები რომ ყველაფერი რიგზეა, submit50 - ბრძანების გამოყენებით შეგიძლია გააგზავნო შენი ნამუშევარი Harvard - ის სისტემაში.

ზუსტი ბრძანება ასე გამოიყურება: 

```bash
submit50 cs50/problems/2022/python/bitcoin
```

სწავლა და ბრძოლა