import string

def veljaven_pin(pin, dolzina):
    if len(pin) != dolzina:
        return False
    vsota = 0
    for i in range(dolzina-1):
        vsota += int(pin[i])
    return int(pin[dolzina-1]) == (vsota % 10)


print(veljaven_pin('12340', 5))
print(veljaven_pin('13576', 5))
print(veljaven_pin('1356', 5))
print(veljaven_pin('13579', 5))
print(veljaven_pin('1234567895', 10))
