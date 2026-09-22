/**
 * Full menu content, transcribed from the client's two supplied PDFs
 * (`Madras Social Menu - FOOD.pdf`, `Madras Social Menu - DRINKS.pdf`,
 * 2026-09-22). Every section, item, price and description here is real —
 * copied from the designed boards, not invented. If the menu changes,
 * this file is the one place to edit; Menu.tsx only renders it.
 *
 * `veg` marks the items that carried the PDF's own vegan-leaf icon.
 */

export type MenuItem = {
  name: string;
  price: string;
  veg?: boolean;
  description?: string;
};

export type MenuSection = {
  name: string;
  tagline?: string;
  note?: string;
  items: MenuItem[];
};

export const FOOD_SECTIONS: MenuSection[] = [
  {
    name: "Rasam & Roots",
    tagline: "Bowls, greens & bright beginnings.",
    items: [
      { name: "Nattu Kozhi Rasam", price: "12", description: "A peppery country-chicken broth simmered with garlic — the South Indian answer to chicken soup." },
      { name: "Banana Stem Hotpot", price: "10.5", veg: true, description: "A comforting Burmese-style bowl of banana stem and chickpeas, finished with crisp plantain fritters." },
      { name: "Madras Karamani Bowl", price: "9", veg: true, description: "Black-eyed peas and fresh sprouts tossed with coconut, mustard and bright South Indian seasoning." },
      { name: "Mango & Clementine Salad", price: "12.75", veg: true, description: "Sweet mango, juicy clementine and mixed greens with a zingy mango-ginger dressing." },
    ],
  },
  {
    name: "Madras Tapas",
    tagline: "Small plates with a southern attitude.",
    items: [
      { name: "Mango Pickle Guac & Assorted Fritters", price: "7", veg: true, description: "Creamy guacamole with a tangy mango-pickle kick, served with assorted fritters." },
      { name: "Beet Poriyal Hummus & Edamame Varuval", price: "12.5", description: "Beetroot, coconut and green chilli blended into hummus, paired with honey-glazed edamame." },
      { name: "Mangalorean Soya Chaap Arancini", price: "13", description: "Crisp, mozzarella-filled soya chaap rice bites with creamy curry mayo." },
      { name: "Cheesy Chicken Punugulu", price: "13.75", description: "Andhra-style fritters packed with minced chicken and a gooey cheese centre." },
      { name: "Honey Chilli Shrimp Lettuce Wrap", price: "13.5", description: "Juicy shrimp and bell peppers in tangy Tangra sauce, tucked into crisp lettuce with peanuts." },
      { name: "Rum-my Kozhi Roast", price: "18", description: "Tender chicken roasted with dark rum, curry leaves and smoky black cardamom." },
      { name: "Madurai Mutton Sukka", price: "20", description: "Bone-in mutton slow-roasted with coconut, red chilli & star anise." },
    ],
  },
  {
    name: "Pottalam Club",
    tagline: "Celebration rice, layered and loaded.",
    items: [
      { name: "Wedding Mutton Biryani", price: "21", description: "Celebration-style goat pilaf with brinjal salna, onion raita and a boiled egg." },
      { name: "Ambur Chicken Biryani", price: "19", description: "Ambur-style chicken and fragrant seeraga samba rice, served with egg, onion raita and brinjal salna." },
      { name: "Madurai Veg Brinji", price: "17", veg: true, description: "A fragrant rice pot with mixed vegetables & soya chunks, served with brinjal salna and onion raita." },
    ],
  },
  {
    name: "Benne Bistro",
    tagline: "Bangalore butter dosas with a Madras Social spin.",
    items: [
      { name: "Benne Masala", price: "16", description: "Bangalore-style thick dosa with potato masala, house podi and a generous gloss of ghee." },
      { name: "Benne Mysore", price: "17", description: "Thick dosa layered with spicy Mysore chutney, potato masala, house podi and ghee." },
      { name: "Paneer Bhurji Benne", price: "19", description: "Thick dosa filled with spiced paneer bhurji, Mysore chutney, house podi and ghee." },
    ],
  },
  {
    name: "Dosa District",
    tagline: "Crisp, comforting and made to tear & share.",
    note: "Dosas & uthappams are served with coconut chutney, tomato chutney & vegetable sambar.",
    items: [
      { name: "Masala Dosa", price: "15", description: "A crisp rice-and-lentil crepe filled with classic spiced potato masala." },
      { name: "Mysore Masala Dosa", price: "16.75", description: "Our crisp dosa spread with fiery Mysore chutney and filled with potato masala." },
      { name: "Paneer Bhurji Dosa", price: "19.75", description: "A crisp dosa filled with grated paneer, onion, tomato and chaat masala." },
      { name: "Pepper Chicken Dosa", price: "19.75", description: "A crisp dosa loaded with bold black-pepper chicken." },
      { name: "Onion Uthappam", price: "15", description: "A thick, fluffy savoury pancake topped with red onion, tomato, green chilli and cilantro." },
      { name: "Madurai Kari Uthappam", price: "18", description: "A thick uthappam topped with rich, slow-cooked Madurai-style mutton kari." },
    ],
  },
  {
    name: "Tiffin Tales",
    tagline: "Breakfast classics, welcome all day.",
    items: [
      { name: "Medu Vada", price: "9", veg: true, description: "Golden lentil doughnuts — crisp outside, fluffy inside, with coconut chutney, tomato chutney and sambar." },
      { name: "Sambar Vada", price: "11", veg: true, description: "Crisp vada soaked in warm vegetable sambar and finished with a spoon of ghee." },
      { name: "Steamed Idli", price: "9", veg: true, description: "Soft steamed rice-and-lentil cakes with sambar, coconut chutney and tomato chutney." },
      { name: "KGF Thatte Idli", price: "11", description: "A big, flat Karnataka-style idli with melted ghee and podi, served with chutneys and sambar." },
    ],
  },
  {
    name: "Main Affairs",
    tagline: "Built for the centre of the table.",
    items: [
      { name: "Malabar Chicken Steak", price: "28", description: "Seared chicken breast with ghee sadam, podi mash, charred asparagus and roasted baby carrots." },
      { name: "Madras Lamb Shank", price: "36.75", description: "Pepper-braised lamb shank with ghee sadam, podi mash, charred asparagus and roasted baby carrots." },
      { name: "Baked Kari Dosa Lasagne", price: "22", description: "Layers of soft kal dosa, spiced mutton kheema, coconut vegetable sauce and bubbling mozzarella." },
      { name: "Lobster & Shrimp Moilee", price: "38.5", description: "Lobster tail and jumbo shrimp in a gentle coconut moilee, with ghee sadam, podi mash, charred asparagus and roasted baby carrots." },
      { name: "Fish Pollichathu", price: "27.5", description: "Whole golden pomfret roasted with South Indian spices, served with ghee sadam, charred asparagus and roasted baby carrots." },
      { name: "Ghee Roast Patta Paneer", price: "23", description: "Paneer wrapped in banana leaf, roasted with ghee and served with ghee sadam, charred asparagus and roasted baby carrots." },
      { name: "Kalan Mushroom Sambar Risotto", price: "22", description: "Coimbatore-style mushroom mash over creamy, buttered sambar rice, finished with crunchy corn chips." },
      { name: "Roasted Pineapple Steak", price: "23", veg: true, description: "Caramelized pineapple steak with coconut reduction, ghee sadam, charred asparagus and roasted baby carrots." },
    ],
  },
  {
    name: "Beyond South",
    tagline: "North Indian favourites, our way. Served with ghee rice.",
    items: [
      { name: "Chicken Tikka Masala", price: "22", description: "Charred chicken tikka folded into a silky tomato-butter masala." },
      { name: "Garlic Lamb Saag", price: "22.75", description: "Slow-braised lamb in a garlicky spinach sauce." },
      { name: "Paneer Tikka Lababdar", price: "19", description: "Charred paneer in a rich, slightly smoky tomato and cashew gravy." },
      { name: "Masala Chole", price: "16", description: "Chickpeas simmered with onion, tomato and warming North Indian spices." },
    ],
  },
  {
    name: "Curry Club",
    tagline: "Southern gravies made for scooping.",
    note: "Served with ghee sadam.",
    items: [
      { name: "Chicken Chettinad", price: "22", description: "Boneless chicken simmered in a bold Chettinad curry with roasted spices and coconut." },
      { name: "Uthukuli Butter Chicken", price: "22", description: "Our southern butter chicken — cashew-rich, coconut-creamy and made for scooping." },
      { name: "Guntur Kara Mutton", price: "23", description: "Slow-braised mutton with fiery Guntur chilli, shallots & garlic." },
      { name: "Malabar Veg Kurma", price: "16", description: "Mixed vegetables in a creamy coconut-cashew sauce scented with poppy seeds." },
      { name: "Gutti Vankaya Kura", price: "17", veg: true, description: "Baby eggplant stuffed with peanut, coconut and chilli, cooked Andhra-style." },
    ],
  },
  {
    name: "Side Kicks",
    tagline: "The extras that never stay extra.",
    items: [
      { name: "Ghee Sadam", price: "7", description: "Steamed rice glossed with fragrant ghee." },
      { name: "Bisi Bele Bhath", price: "11", description: "Karnataka-style rice and lentils cooked with vegetables and warm spices." },
      { name: "Garlic Naan", price: "5", description: "Soft flatbread brushed with garlic butter." },
      { name: "Flaky Parotta", price: "5", description: "Layered South Indian flatbread, crisp at the edges and soft inside." },
      { name: "Onion Raita", price: "4", description: "Cool yogurt with sliced onion & gentle spices." },
      { name: "Mango Pickle", price: "4" },
      { name: "Tapioca Chips", price: "5" },
    ],
  },
  {
    name: "Sweet Social",
    tagline: "Save room. Seriously.",
    items: [
      { name: "Tirunelveli Halwa", price: "11", description: "Glossy wheat halwa with roasted cashews and rich ghee finish." },
      { name: "Pistachio Semiya Kunafa", price: "10", description: "Crisp vermicelli, creamy kunafa filling and pistachio sauce in every bite. (Add ice cream +2)" },
      { name: "Blueberry Bliss", price: "12.75", description: "Warm blueberries and white-chocolate melt with bright berry compote." },
      { name: "Filter Kaapi Tiramisu", price: "8.5", description: "Coffee-soaked ladyfingers layered with cream and finished with bold South Indian filter coffee." },
    ],
  },
];

export const SIGNATURE_COCKTAILS: MenuItem[] = [
  { name: "Ambur", price: "23", description: "Basmati Gin • Tamarind • Citrus • Floral • South Indian Spices" },
  { name: "Ooty", price: "21", description: "Strawberry Gin • Citrus • Herbs • Cheesecake Foam" },
  { name: "Mangaluru", price: "22", description: "Curry Leaves Reposado • Ginger Lime • Tropical Fruits • Spices" },
  { name: "Kumbakonam", price: "22", description: "Whiskey • Jaggery • Bitters • Spices • Smoke" },
  { name: "Coromandel", price: "19", description: "Rum • Coconut • Pineapple • Lime • Herbs" },
  { name: "Chettinad", price: "23", description: "Vodka • Rasam • Citrus • Floral • South Indian Spices" },
];

export const DRINKS_SECTIONS: MenuSection[] = [
  {
    name: "Classic Cocktails",
    items: [
      { name: "Old Fashioned", price: "14", description: "Bourbon, Demerara, Bitters" },
      { name: "Negroni", price: "14", description: "Gin, Campari, Sweet Vermouth" },
      { name: "Margarita", price: "13", description: "Tequila, Cointreau, Lime" },
      { name: "Mojito", price: "12", description: "White Rum, Mint, Lime, Soda" },
      { name: "Cosmopolitan", price: "13", description: "Vodka, Cointreau, Cranberry, Lime" },
      { name: "Espresso Martini", price: "14", description: "Vodka, Coffee Liqueur, Espresso" },
      { name: "Daiquiri", price: "12", description: "White Rum, Lime, Sugar" },
      { name: "Whiskey Sour", price: "13", description: "Bourbon, Lemon, Sugar, Egg White" },
      { name: "Gin Martini", price: "13", description: "Gin, Dry Vermouth" },
      { name: "Manhattan", price: "14", description: "Rye, Sweet Vermouth, Bitters" },
      { name: "Pina Colada", price: "13", description: "Rum, Coconut, Pineapple" },
      { name: "Bloody Mary", price: "13", description: "Vodka, Tomato, Spices" },
      { name: "Tom Collins", price: "12", description: "Gin, Lemon, Soda" },
      { name: "Sazerac", price: "14", description: "Rye, Absinthe, Bitters" },
      { name: "French 75", price: "14", description: "Gin, Lemon, Champagne" },
      { name: "Daiquiri (Flavoured)", price: "13", description: "Strawberry / Mango / Passion Fruit" },
    ],
  },
  {
    name: "Madras Refreshers",
    items: [
      { name: "Filter Kapi", price: "6" },
      { name: "Chilled Filter Coffee", price: "9" },
      { name: "Nannari Sharbat", price: "7" },
      { name: "Mango Mood", price: "9" },
      { name: "Rose Cloud", price: "9" },
      { name: "Manga Moru", price: "7", description: "Mango Buttermilk" },
      { name: "The Usual Fizz", price: "3" },
      { name: "Still & Simple", price: "3", description: "Water" },
      { name: "Pop", price: "3" },
    ],
  },
  {
    name: "Red Wines",
    items: [
      { name: "Cabernet Sauvignon", price: "10 | 45" },
      { name: "Shiraz", price: "10 | 45" },
      { name: "Merlot", price: "10 | 45" },
      { name: "Pinot Noir", price: "12 | 55" },
    ],
  },
  {
    name: "White Wines",
    items: [
      { name: "Chardonnay", price: "10 | 45" },
      { name: "Sauvignon Blanc", price: "10 | 45" },
      { name: "Riesling", price: "10 | 45" },
      { name: "Pinot Grigio", price: "12 | 55" },
    ],
  },
  {
    name: "Rosé Wines",
    items: [
      { name: "White Zinfandel", price: "10 | 45" },
      { name: "Rose D'Anjou", price: "12 | 55" },
    ],
  },
  {
    name: "Sparkling and Champagne",
    items: [
      { name: "Prosecco", price: "12 | 55" },
      { name: "Sparkling Wine", price: "14 | 65" },
      { name: "Hugo Spritz", price: "14 | 65" },
      { name: "Campari Spritz", price: "14 | 55" },
      { name: "Moet & Chandon", price: "165" },
      { name: "Veuve Clicquot", price: "195" },
      { name: "Dom Perignon", price: "350" },
      { name: "Hugo Spritz", price: "16 | 75", description: "Champagne" },
      { name: "Campari Spritz", price: "16 | 75", description: "Champagne" },
    ],
  },
  {
    name: "Beer",
    items: [
      { name: "Heineken", price: "8" },
      { name: "Corona", price: "8" },
      { name: "Stella", price: "8" },
    ],
  },
];
