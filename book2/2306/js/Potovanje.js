DEXi.model = {
name: "",
description: "",
version: "5.02",
created: "2019-05-11T23:42:19",
attributes: [
  {
    id: "potovanje",
    name: "Potovanje",
    description: "",
    indent: "",
    attributes: [
      {
        id: "ekonomi\u010Dnost",
        name: "Ekonomi\u010Dnost",
        description: "",
        indent: "*",
        attributes: [
          {
            id: "cena",
            name: "Cena",
            description: "",
            indent: "|*",
            attributes: [
            ],
            scale: {
              order: "ascending",
              values: [
                {
                  name: "visoka",
                  description: "",
                  group: "bad",
                },
                {
                  name: "srednja",
                  description: "",
                  group: "neutral",
                },
                {
                  name: "nizka",
                  description: "",
                  group: "good",
                }
              ],
            },
            funct: {
            }
          },
          {
            id: "dopla\u010Dila",
            name: "Dopla\u010Dila",
            description: "",
            indent: "|+",
            attributes: [
            ],
            scale: {
              order: "ascending",
              values: [
                {
                  name: "visoka",
                  description: "",
                  group: "bad",
                },
                {
                  name: "srednja",
                  description: "",
                  group: "neutral",
                },
                {
                  name: "nizka",
                  description: "",
                  group: "good",
                }
              ],
            },
            funct: {
            }
          }
        ],
        scale: {
          order: "ascending",
          values: [
            {
              name: "nesprejemljivo",
              description: "",
              group: "bad",
            },
            {
              name: "sprejemljivo",
              description: "",
              group: "neutral",
            },
            {
              name: "dobro",
              description: "",
              group: "neutral",
            },
            {
              name: "odli\u010Dno",
              description: "",
              group: "good",
            }
          ],
        },
        funct: {
          description: "",
          dimensions: [3, 3],
          values: [0, 0, 0, 0, 1, 2, 1, 2, 3],
          auto: []
        }
      },
      {
        id: "destinacija",
        name: "Destinacija",
        description: "",
        indent: "*",
        attributes: [
          {
            id: "znamenitosti",
            name: "Znamenitosti",
            description: "",
            indent: "|*",
            attributes: [
            ],
            scale: {
              order: "ascending",
              values: [
                {
                  name: "malo",
                  description: "",
                  group: "bad",
                },
                {
                  name: "srednje",
                  description: "",
                  group: "neutral",
                },
                {
                  name: "veliko",
                  description: "",
                  group: "good",
                }
              ],
            },
            funct: {
            }
          },
          {
            id: "nastanitev",
            name: "Nastanitev",
            description: "",
            indent: "|*",
            attributes: [
            ],
            scale: {
              order: "ascending",
              values: [
                {
                  name: "neustrezna",
                  description: "",
                  group: "bad",
                },
                {
                  name: "ustrezna",
                  description: "",
                  group: "neutral",
                },
                {
                  name: "zelo ustrezna",
                  description: "",
                  group: "good",
                }
              ],
            },
            funct: {
            }
          },
          {
            id: "zabava",
            name: "Zabava",
            description: "",
            indent: "|*",
            attributes: [
            ],
            scale: {
              order: "ascending",
              values: [
                {
                  name: "malo",
                  description: "",
                  group: "bad",
                },
                {
                  name: "srednje",
                  description: "",
                  group: "neutral",
                },
                {
                  name: "veliko",
                  description: "",
                  group: "good",
                }
              ],
            },
            funct: {
            }
          },
          {
            id: "prehrana",
            name: "Prehrana",
            description: "",
            indent: "|+",
            attributes: [
            ],
            scale: {
              order: "ascending",
              values: [
                {
                  name: "neustrezna",
                  description: "",
                  group: "bad",
                },
                {
                  name: "ustrezna",
                  description: "",
                  group: "neutral",
                },
                {
                  name: "zelo ustrezna",
                  description: "",
                  group: "good",
                }
              ],
            },
            funct: {
            }
          }
        ],
        scale: {
          order: "ascending",
          values: [
            {
              name: "nesprejemljivo",
              description: "",
              group: "bad",
            },
            {
              name: "sprejemljivo",
              description: "",
              group: "neutral",
            },
            {
              name: "dobro",
              description: "",
              group: "neutral",
            },
            {
              name: "odli\u010Dno",
              description: "",
              group: "good",
            }
          ],
        },
        funct: {
          description: "",
          dimensions: [3, 3, 3, 3],
          values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 3, 3, 3, 3, 3],
          auto: []
        }
      },
      {
        id: "prevoz",
        name: "Prevoz",
        description: "",
        indent: "+",
        attributes: [
        ],
        scale: {
          order: "ascending",
          values: [
            {
              name: "neustrezen",
              description: "",
              group: "bad",
            },
            {
              name: "ustrezen",
              description: "",
              group: "neutral",
            },
            {
              name: "zelo ustrezen",
              description: "",
              group: "good",
            }
          ],
        },
        funct: {
        }
      }
    ],
    scale: {
      order: "ascending",
      values: [
        {
          name: "neustrezno",
          description: "",
          group: "bad",
        },
        {
          name: "manj ustrezno",
          description: "",
          group: "neutral",
        },
        {
          name: "ustrezno",
          description: "",
          group: "neutral",
        },
        {
          name: "odli\u010Dno",
          description: "",
          group: "good",
        }
      ],
    },
    funct: {
      description: "",
      dimensions: [4, 4, 3],
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 2, 0, 2, 2, 0, 0, 0, 0, 1, 1, 0, 2, 2, 0, 2, 3, 0, 0, 0, 0, 1, 1, 0, 2, 3, 0, 3, 3],
      auto: []
    }
  }
]
}
