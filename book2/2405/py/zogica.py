# encoding: utf-8
import tkinter as tk

# Definicija globalnih spremenljivk
SIRINA = 400
VISINA = 300

hitrost_x = 4
hitrost_y = 5

# Ustvari okno in platno
okno = tk.Tk()
okno.title("Žogica")

platno = tk.Canvas(okno, width=SIRINA, height=VISINA)
platno.configure(bg="black")
platno.pack()

zogica = platno.create_oval(10, 10, 40, 40, fill="white")

# Določi animacijo
def animacija():
  global hitrost_x, hitrost_y
  platno.move(zogica, hitrost_x, hitrost_y)
  polozaj = platno.coords(zogica)
  if polozaj[3] >= VISINA or polozaj[1] <= 0:
    hitrost_y = -hitrost_y
  if polozaj[2] >= SIRINA or polozaj[0] <= 0:
    hitrost_x = -hitrost_x
  okno.update()
  okno.after(20, animacija)

# Zaženi dogodkovno zanko
animacija()
okno.mainloop()
