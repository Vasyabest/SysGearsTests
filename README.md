# SysGearsTests
Genetic Algorithm task for SysGears - Web Software Development Company
Test task on Genetic Algorithm

Task:
You are working with a delivery company that uses paid daily
by road. Travel fee is charged at 10 points of payment.
located along the road. Company drivers need to go all the way,
paying the commission for travel on each of the points.
The difficulty is that according to the rules, only one commission can be paid
single coin. In case its face value is higher than the fare,
the driver does not receive change and the rest is burned. If the coin, on the contrary, is not completely
covers the fare, then your company has a debt. 
Wherein
the fare on each of the points changes absolutely at random at the end of the day,
and may vary in the range from 1st to 10 kopecks, inclusive. Also
It is known that several payment points may charge the same value.
fare, and the total amount of travel through all the points will always be more than 55 kopecks.
At the beginning of the journey, each driver is issued 10 coins, one coin each
dignity (i.e., one coin worth a penny, one coin worth two
a penny, one - three, and so on, up to ten kopecks inclusive). 

Using genetic
algorithm, you need to find a travel payment strategy in which the debt
driver at the end of the road will be minimal. The algorithm will be applied by the company in
the beginning of each day, and use data on new, newly installed,
commissions on payment points for obtaining a new strategy for drivers.
Incoming parameters:
An array of ten arbitrary numbers from 1 to 10, representing dimensions
commissions on each of the items. The numbers in the array can be repeated, and their sum will be
always more than 55.


Output:
An array of ten numbers representing the virtues of the coins located in
order, optimal for payments on each of the points (so that the company's debt after
All payments were minimal).

Задача:
Вы работаете с компанией по доставке товаров, которая ежедневно пользуется платной
автомобильной дорогой. Плата за путешествие взимается на 10-и пунктах оплаты
расположенных вдоль дороги. Водителям компании необходимо преодолеть весь путь,
оплатив комиссию за проезд на каждом из пунктов.
Сложность состоит в том, что по правилам, комиссию можно оплачивать только одной
единственной монетой. В случае, если ее номинал выше, чем стоимость проезда,
водитель сдачу не получает и остаток сгорает. Если же монета, наоборот, не полностью
покрывает стоимость проезда, то вашей компании насчитывается долг. При этом
стоимость проезда на каждом из пунктов абсолютно произвольно изменяется в конце дня,
и может варьироваться в диапазоне от 1-ой до 10-и копеек включительно. Также
известно, что несколько пунктов оплаты могут выставлять одну и ту же стоимость
проезда, а общая сумма проезда через все пункты будет всегда больше 55-и копеек.
Каждому водителю в начале пути выдается 10 монет, по одной монете каждого
достоинства (т.е. одна монета достоинством в копейку, одна монета достоинством в две
копейки, одна - три, и так далее, до десяти копеек включительно). Используя генетический
алгоритм, вам необходимо найти такую стратегию оплат путешествия, при которой долг
водителя в конце пути будет минимальным. Алгоритм будет применяться компанией в
начале каждого дня, и использовать данные по новым, только что установленным,
размерам комиссий на пунктах оплат для получения новой стратегии для водителей.
Входящие параметры:
Массив из десяти произвольных чисел от 1 до 10, представляющих собой размеры
комиссий на каждом из пунктов. Числа в массиве могут повторятся, и их сумма будет
всегда больше чем 55.
Выходные данные:
Массив из десяти чисел, представляющих собой достоинства монет, расположенные в
порядке, оптимальном для оплат на каждом из пунктов (так чтобы долг компании после
всех оплат был минимальным).
