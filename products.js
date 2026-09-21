"use strict";

function createProducts(category, rows) {
  const dessert = category === "dessert";

  const quantities = dessert
    ? ["50 g", "100 g", "200 g"]
    : ["200 ml", "300 ml", "400 ml"];

  const additiveNames = dessert
    ? ["Berries", "Nuts", "Jam"]
    : category === "tea"
      ? ["Sugar", "Lemon", "Syrup"]
      : ["Sugar", "Cinnamon", "Syrup"];

  return rows.map(([name, description, price], index) => ({
    id: `${category}-${index + 1}`,
    name,
    description,
    price,
    category,
    image: `./assets/${category}-${index + 1}.jpg`,
    sizes: {
      s: { size: quantities[0], "add-price": "0.00" },
      m: { size: quantities[1], "add-price": "0.50" },
      l: { size: quantities[2], "add-price": "1.00" }
    },
    additives: additiveNames.map((name) => ({
      name,
      "add-price": "0.50"
    }))
  }));
}

const products = [
  ...createProducts("coffee", [
    [
      "Irish coffee",
      "Fragrant black coffee with Jameson Irish whiskey and whipped milk",
      "7.00"
    ],
    [
      "Kahlua coffee",
      "Classic coffee with milk and Kahlua liqueur under a cap of frothed milk",
      "7.00"
    ],
    [
      "Honey raf",
      "Espresso with frothed milk, cream and aromatic honey",
      "5.50"
    ],
    [
      "Ice cappuccino",
      "Cappuccino with soft thick foam in summer version with ice",
      "5.00"
    ],
    [
      "Espresso",
      "Classic black coffee",
      "4.50"
    ],
    [
      "Latte",
      "Espresso coffee with the addition of steamed milk and dense milk foam",
      "5.50"
    ],
    [
      "Latte macchiato",
      "Espresso with frothed milk and chocolate",
      "5.50"
    ],
    [
      "Coffee with cognac",
      "Fragrant black coffee with cognac and whipped cream",
      "6.50"
    ]
  ]),

  ...createProducts("tea", [
    [
      "Moroccan",
      "Fragrant black tea with the addition of tangerine, cinnamon, honey, lemon and mint",
      "4.50"
    ],
    [
      "Ginger",
      "Original black tea with fresh ginger, lemon and honey",
      "5.00"
    ],
    [
      "Cranberry",
      "Invigorating black tea with cranberry and honey",
      "5.00"
    ],
    [
      "Sea buckthorn",
      "Toning sweet black tea with sea buckthorn, fresh thyme and cinnamon",
      "5.50"
    ]
  ]),

  ...createProducts("dessert", [
    [
      "Marble cheesecake",
      "Philadelphia cheese with lemon zest on a light sponge cake and red currant jam",
      "3.50"
    ],
    [
      "Red velvet",
      "Layer cake with cream cheese frosting",
      "4.00"
    ],
    [
      "Cheesecakes",
      "Soft cottage cheese pancakes with sour cream and fresh berries and sprinkled with powdered sugar",
      "4.50"
    ],
    [
      "Creme brulee",
      "Delicate creamy dessert in a caramel basket with wild berries",
      "4.00"
    ],
    [
      "Pancakes",
      "Tender pancakes with strawberry jam and fresh strawberries",
      "4.50"
    ],
    [
      "Honey cake",
      "Classic honey cake with delicate custard",
      "4.50"
    ],
    [
      "Chocolate cake",
      "Cake with hot chocolate filling and nuts with dried apricots",
      "5.50"
    ],
    [
      "Black forest",
      "A combination of thin sponge cake with cherry jam and light chocolate mousse",
      "6.50"
    ]
  ])
];