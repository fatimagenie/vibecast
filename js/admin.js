/* ========================================
   VibeCast Admin Panel - Core Logic
   Authentication, CRUD, localStorage
   ======================================== */

// ========== CONSTANTS ==========
const ADMIN_PASSWORD_KEY = 'vibecast-admin-password';
const OUTFITS_KEY = 'vibecast-outfits';
const FOOD_KEY = 'vibecast-food';
const TRAVEL_KEY = 'vibecast-travel';
const TIPS_KEY = 'vibecast-tips';
const SETTINGS_KEY = 'vibecast-settings';
const AUTH_KEY = 'vibecast-admin-auth';
const DEFAULT_PASSWORD = 'Wather@';

// ========== DEFAULT DATA (Hardcoded fallbacks) ==========
const DEFAULT_OUTFITS = {
    hot: [
        { name: "Cotton Kurta / Kameez", desc: "Light, breathable fabric for hot summer days", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Linen Summer Shirt", desc: "Cool and stylish linen shirt for outdoor wear", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Wide-Brim Straw Hat", desc: "Protect yourself from harsh UV rays", image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Polarized Sunglasses", desc: "UV400 protection for bright sunny days", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Breathable Sandals", desc: "Comfortable open-toe footwear for summer", image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "SPF 50+ Sunscreen", desc: "Essential skin protection from UV damage", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Light Chinos", desc: "Comfortable lightweight pants for everyday", image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Cotton Scarf / Dupatta", desc: "Versatile accessory for sun and style", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc64?w=500&h=600&fit=crop", affiliateUrl: "#" }
    ],
    rainy: [
        { name: "Waterproof Jacket", desc: "Stay dry with a lightweight rain jacket", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Compact Umbrella", desc: "Foldable umbrella that fits in your bag", image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Rain Boots", desc: "Waterproof boots for puddle-proof walks", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Quick-Dry Pants", desc: "Drying fast, perfect for wet weather", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Waterproof Bag Cover", desc: "Protect your belongings from rain", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Rain Poncho", desc: "Full-body protection in heavy downpour", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Waterproof Phone Case", desc: "Keep your phone safe from water damage", image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Fleece Hoodie", desc: "Warm layer for cool rainy evenings", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=600&fit=crop", affiliateUrl: "#" }
    ],
    cold: [
        { name: "Wool Sweater", desc: "Cozy knitwear for chilly winter days", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Down Puffer Jacket", desc: "Maximum warmth with lightweight fill", image: "https://images.unsplash.com/photo-1544923246-77307dd270da?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Thermal Innerwear Set", desc: "Base layer for extreme cold protection", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Knitted Beanie", desc: "Keep your head warm in freezing temps", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Leather Gloves", desc: "Stylish and warm hand protection", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Winter Boots", desc: "Insulated boots with grip for icy roads", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Scarf / Muffler", desc: "Warm neck protection in cold winds", image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=500&h=600&fit=crop", affiliateUrl: "#" },
        { name: "Warm Socks (Pack of 3)", desc: "Thick cushioned socks for cold feet", image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c87?w=500&h=600&fit=crop", affiliateUrl: "#" }
    ]
};

const DEFAULT_FOOD = {
    hot: [
        { name: "Dahi / Raita", desc: "Cooling yogurt with spices and herbs", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups plain yogurt", "1/2 tsp cumin powder", "Salt to taste", "Fresh coriander", "1 green chili (finely chopped)", "Pinch of chaat masala"], recipe: ["Whisk yogurt until smooth in a bowl", "Add cumin powder, salt, and chaat masala", "Mix in finely chopped green chili", "Garnish with fresh coriander leaves", "Chill for 15 minutes before serving", "Serve cold with meals or as a dip"] },
        { name: "Mango Lassi", desc: "Sweet and refreshing yogurt drink", image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["1 ripe mango (peeled & chopped)", "1 cup cold yogurt", "1/2 cup cold milk", "2 tbsp sugar or honey", "Ice cubes", "Pinch of cardamom powder"], recipe: ["Add mango pieces to a blender", "Pour in cold yogurt and milk", "Add sugar or honey to taste", "Blend until smooth and creamy", "Add ice cubes and blend briefly", "Pour into glasses and sprinkle cardamom"] },
        { name: "Watermelon", desc: "Hydrating and naturally sweet summer fruit", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["1 large watermelon", "Black salt (optional)", "Chaat masala (optional)", "Lemon juice", "Fresh mint leaves"], recipe: ["Chill watermelon in fridge for 2 hours", "Cut into halves or slices", "Remove seeds if needed", "Sprinkle black salt and chaat masala", "Squeeze a little lemon juice on top", "Garnish with mint leaves and serve cold"] },
        { name: "Cucumber Salad", desc: "Crisp and refreshing side dish", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cucumbers", "1 tomato", "1 green chili", "Salt to taste", "Chaat masala", "Lemon juice", "Fresh coriander"], recipe: ["Wash and slice cucumbers into thin rounds", "Dice tomato into small cubes", "Chop green chili finely", "Mix everything in a bowl", "Add salt, chaat masala and lemon juice", "Toss well and serve chilled"] },
        { name: "Cold Coffee", desc: "Chilled coffee with ice cream topping", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 tbsp instant coffee", "1 cup cold milk", "2 tbsp sugar", "Ice cubes", "1 scoop vanilla ice cream", "Chocolate syrup (optional)"], recipe: ["Dissolve coffee in 2 tbsp warm water", "Add sugar and mix well", "Pour cold milk into a blender", "Add coffee mixture and ice cubes", "Blend until frothy", "Pour in glass, top with ice cream and chocolate syrup"] },
        { name: "Fruit Chaat", desc: "Mixed seasonal fruits with chat masala", image: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["1 apple (diced)", "2 bananas (sliced)", "1 cup grapes", "1 cup watermelon cubes", "Chaat masala", "Black salt", "Lemon juice", "Fresh mint"], recipe: ["Wash all fruits thoroughly", "Cut apple into small cubes", "Slice bananas into rounds", "Halve the grapes", "Combine all fruits in a large bowl", "Sprinkle chaat masala and black salt", "Squeeze lemon juice and toss gently", "Garnish with mint and serve fresh"] },
        { name: "Mint Lemonade", desc: "Fresh mint blended with tangy lemon", image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["10-12 fresh mint leaves", "3 lemons (juiced)", "4 tbsp sugar", "4 cups cold water", "Ice cubes", "Black salt (optional)"], recipe: ["Boil 1/2 cup water with sugar until dissolved", "Let the sugar syrup cool completely", "Blend mint leaves with a little water", "Strain the mint juice through a sieve", "Mix lemon juice, mint juice, and sugar syrup", "Add cold water and stir well", "Serve over ice cubes with a mint sprig"] },
        { name: "Golgappa / Pani Puri", desc: "Crispy shells with tangy water", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["24 ready-made puri shells", "2 potatoes (boiled & mashed)", "1 cup boiled chickpeas", "Tamarind chutney", "Mint-coriander chutney", "Cumin powder", "Chaat masala", "Cold water"], recipe: ["Boil and mash potatoes with salt", "Mix chickpeas with cumin and chaat masala", "Prepare tamarind chutney (sweet)", "Blend mint, coriander with water for green chutney", "Mix all chutneys with cold water for pani", "Make a small hole in each puri shell", "Fill with potato-chickpea mixture", "Dip in flavored pani and eat immediately"] },
        { name: "Aam Panna", desc: "Tangy raw mango summer drink", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 raw green mangoes", "3 tbsp sugar or jaggery", "1 tsp cumin powder", "Fresh mint leaves", "Black salt", "Pinch of black pepper", "4 cups cold water"], recipe: ["Boil raw mangoes until soft and pulpy", "Peel and squeeze out the pulp", "Dissolve sugar in a little warm water", "Mix mango pulp, sugar water, and cold water", "Add cumin powder, black salt, and pepper", "Blend with mint leaves until smooth", "Strain and serve over ice cubes"] },
        { name: "Chana Chaat", desc: "Spicy chickpea street snack", image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups boiled chickpeas", "1 onion (finely chopped)", "1 tomato (diced)", "Green chilies", "Chaat masala", "Cumin powder", "Lemon juice", "Fresh coriander"], recipe: ["Boil chickpeas until tender or use canned", "Chop onion, tomato, and green chilies finely", "Combine chickpeas with chopped vegetables", "Add chaat masala and cumin powder", "Squeeze fresh lemon juice over mixture", "Toss everything together gently", "Garnish with fresh coriander and serve"] }
    ],
    rainy: [
        { name: "Hot Pakoras", desc: "Crispy fried fritters with green chutney", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["1 cup besan (gram flour)", "2 potatoes (sliced thin)", "1 onion (sliced)", "Green chilies", "Cumin seeds", "Salt", "Ajwain (carom seeds)", "Oil for frying"], recipe: ["Mix besan with water to make thick batter", "Add salt, cumin seeds, and ajwain", "Mix in sliced potatoes and onions", "Add chopped green chilies", "Heat oil in a deep pan", "Drop spoonfuls of batter into hot oil", "Fry until golden brown on both sides", "Drain on paper towels and serve hot with chutney"] },
        { name: "Samosa", desc: "Golden crispy pastry with spiced filling", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups flour (maida)", "4 potatoes (boiled & mashed)", "1 cup peas", "Cumin seeds", "Garam masala", "Green chilies", "Fresh coriander", "Oil for frying"], recipe: ["Make stiff dough with flour, salt and oil", "Rest dough for 30 minutes", "Heat oil, add cumin seeds and green chilies", "Add mashed potatoes and peas", "Season with garam masala, salt, and coriander", "Roll dough and cut into semi-circles", "Form cones and fill with potato mixture", "Seal edges and deep fry until golden"] },
        { name: "Karak Chai", desc: "Strong spiced tea to warm your soul", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups water", "1 cup milk", "2 tbsp loose tea leaves", "3-4 sugar cubes", "2 cardamom pods", "1 inch ginger (crushed)", "Pinch of baking soda"], recipe: ["Boil water with crushed ginger", "Add tea leaves and cardamom pods", "Let it brew on medium heat for 3 minutes", "Add a pinch of baking soda for color", "Pour in milk and bring to boil", "Add sugar and simmer for 2 minutes", "Strain into cups and serve piping hot"] },
        { name: "Chicken Soup", desc: "Hot and soothing comfort in a bowl", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["500g chicken (bone-in)", "1 onion (chopped)", "2 carrots (diced)", "2 celery stalks", "3 garlic cloves", "Black pepper", "Salt", "Fresh parsley"], recipe: ["Boil chicken in water for 30 minutes", "Remove chicken and shred the meat", "Strain the broth and return to pot", "Add onions, carrots, and celery", "Cook until vegetables are tender", "Add shredded chicken back to pot", "Season with salt and black pepper", "Garnish with parsley and serve hot"] },
        { name: "Biryani", desc: "Aromatic rice with tender spiced meat", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["500g chicken/mutton", "2 cups basmati rice", "2 onions (fried)", "1 cup yogurt", "Biryani masala", "Saffron milk", "Mint leaves", "Ghee", "Whole spices"], recipe: ["Marinate meat with yogurt and biryani masala for 1 hour", "Parboil rice with whole spices until 70% done", "Layer marinated meat in a heavy pot", "Top with parboil rice evenly", "Sprinkle fried onions, mint, and saffron milk", "Seal with foil and place lid tightly", "Cook on low heat (dum) for 25 minutes", "Gently mix layers and serve with raita"] },
        { name: "Naan with Karahi", desc: "Soft bread with rich gravy curry", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups flour", "Yogurt", "Yeast", "500g chicken", "Tomatoes", "Green chilies", "Ginger", "Garlic", "Karahi masala"], recipe: ["Mix flour, yogurt, yeast and knead soft dough", "Rest dough for 2 hours until doubled", "Cook chicken with ginger-garlic paste", "Add chopped tomatoes and karahi masala", "Cook until oil separates from gravy", "Add green chilies and simmer", "Roll naan dough and cook on tawa or tandoor", "Brush with butter and serve together"] },
        { name: "Halwa Puri", desc: "Sweet halwa with crispy deep-fried bread", image: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups semolina (suji)", "1 cup sugar", "1/2 cup ghee", "Water", "Cardamom", "Food color (orange)", "Flour for puri", "Oil for frying"], recipe: ["Roast semolina in ghee until golden and aromatic", "Prepare sugar syrup with cardamom", "Slowly add syrup to semolina while stirring", "Add food color and mix well", "Make puri dough with flour, salt, and water", "Roll into thin circles", "Deep fry in hot oil until puffed", "Serve hot halwa with puris"] },
        { name: "French Fries", desc: "Crispy golden fries with ketchup", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["4 large potatoes", "Oil for deep frying", "Salt", "Black pepper", "Paprika (optional)", "Ketchup for serving"], recipe: ["Peel and cut potatoes into thin strips", "Soak in cold water for 30 minutes", "Drain and pat completely dry with towel", "Heat oil to 160°C and fry for 3 minutes", "Remove and let cool for 5 minutes", "Increase oil heat to 190°C", "Fry again until golden and crispy", "Season with salt and serve with ketchup"] },
        { name: "Aloo Paratha", desc: "Crispy stuffed potato flatbread", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups whole wheat flour", "3 potatoes (boiled and mashed)", "1 green chili (chopped)", "Cumin seeds", "Fresh coriander", "Salt to taste", "Ghee for cooking"], recipe: ["Mix flour, salt and knead soft dough", "Rest dough for 20 minutes", "Mix mashed potatoes with chili, cumin, coriander and salt", "Divide dough and potato filling into equal balls", "Roll dough, place filling in center and seal", "Roll into flat circles carefully", "Cook on hot tawa with ghee on both sides", "Serve hot with yogurt and pickle"] },
        { name: "Pakora Chaat", desc: "Crispy fritters with tangy chutneys", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["1 cup besan (gram flour)", "1 potato (sliced)", "1 onion (sliced)", "Green chilies", "Tamarind chutney", "Mint-coriander chutney", "Whisked yogurt", "Chaat masala"], recipe: ["Mix besan with water, salt and spices for batter", "Dip potato and onion slices in batter", "Deep fry until golden and crispy", "Arrange pakoras on a serving plate", "Drizzle tamarind and mint chutneys on top", "Add whisked yogurt over the pakoras", "Sprinkle chaat masala generously", "Serve immediately while crispy"] }
    ],
    cold: [
        { name: "Chicken Soup", desc: "Steaming hot soup for cold winter nights", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["500g chicken (bone-in)", "1 onion", "2 carrots", "2 celery stalks", "3 garlic cloves", "Black pepper", "Salt", "Fresh parsley"], recipe: ["Boil chicken in water for 30 minutes", "Remove chicken and shred the meat", "Strain the broth and return to pot", "Add onions, carrots, and celery", "Cook until vegetables are tender", "Add shredded chicken back to pot", "Season with salt and black pepper", "Garnish with parsley and serve hot"] },
        { name: "Garam Chai", desc: "Traditional spiced hot tea", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups water", "1 cup milk", "2 tbsp loose tea leaves", "3-4 sugar cubes", "2 cardamom pods", "1 inch ginger (crushed)", "Pinch of baking soda"], recipe: ["Boil water with crushed ginger", "Add tea leaves and cardamom pods", "Let it brew on medium heat for 3 minutes", "Add a pinch of baking soda for color", "Pour in milk and bring to boil", "Add sugar and simmer for 2 minutes", "Strain into cups and serve piping hot"] },
        { name: "Butter Chicken", desc: "Creamy rich curry, perfect with naan", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["500g chicken", "1 cup yogurt", "2 tbsp butter", "1 cup cream", "Tomato puree", "Garam masala", "Kashmiri chili", "Ginger-garlic paste", "Kasuri methi"], recipe: ["Marinate chicken in yogurt and spices for 2 hours", "Grill or pan-fry marinated chicken", "Heat butter and cook ginger-garlic paste", "Add tomato puree and cook for 10 minutes", "Add garam masala and Kashmiri chili", "Pour in cream and kasuri methi", "Add grilled chicken pieces", "Simmer for 5 minutes and serve with naan"] },
        { name: "Sarson ka Saag", desc: "Traditional mustard greens with makki roti", image: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["1 bunch mustard greens", "1/2 bunch spinach", "2 green chilies", "Ginger", "Garlic", "Maize flour", "Ghee", "Salt"], recipe: ["Wash and chop mustard greens and spinach", "Boil greens with green chilies until soft", "Mash or blend to coarse paste", "Heat ghee and add ginger-garlic paste", "Add greens paste and cook for 15 minutes", "Mix in maize flour for thickening", "Cook on low heat stirring constantly", "Serve hot with makki roti and butter"] },
        { name: "Haleem", desc: "Slow-cooked meat and lentil stew", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["500g chicken/mutton", "1 cup mixed lentils", "1/2 cup barley", "Onions", "Ginger-garlic paste", "Haleem masala", "Ghee", "Fried onions", "Lemon"], recipe: ["Soak lentils and barley overnight", "Cook meat with haleem masala until tender", "Boil soaked lentils and barley until mushy", "Blend lentil mixture to smooth paste", "Combine meat and lentil paste", "Cook on very low heat for 2 hours", "Stir continuously until thick and stretchy", "Garnish with fried onions, lemon, and ginger"] },
        { name: "Gajar ka Halwa", desc: "Sweet carrot pudding with cardamom", image: "https://images.unsplash.com/photo-1666190462699-e1fef2e8d09d?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["1 kg carrots (grated)", "1 cup milk", "1/2 cup sugar", "3 tbsp ghee", "Cardamom powder", "Cashews", "Almonds", "Raisins"], recipe: ["Peel and grate carrots finely", "Heat ghee in a heavy pan", "Add grated carrots and cook for 10 minutes", "Pour in milk and cook until absorbed", "Add sugar and stir continuously", "Cook until mixture leaves the sides of pan", "Add cardamom powder and mix well", "Garnish with cashews, almonds and raisins"] },
        { name: "Hot Coffee", desc: "Freshly brewed coffee to beat the cold", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 tbsp instant coffee", "1 cup hot water", "1 cup hot milk", "2 tbsp sugar", "Cocoa powder (optional)", "Whipped cream (optional)"], recipe: ["Boil water and let it cool for 30 seconds", "Add coffee powder to a cup", "Pour hot water and stir until dissolved", "Heat milk separately until steaming", "Add sugar to coffee and mix well", "Pour hot milk over the coffee", "Top with cocoa powder or whipped cream", "Serve immediately and enjoy the warmth"] },
        { name: "Naan with Haleem", desc: "Warm bread dipped in rich stew", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["2 cups flour", "Yeast", "Yogurt", "1 cup haleem (pre-made)", "Ghee", "Fried onions", "Lemon", "Green chilies"], recipe: ["Prepare naan dough with flour, yeast, and yogurt", "Rest dough for 2 hours until doubled", "Heat haleem in a pan until bubbling", "Roll naan and cook on tawa until golden", "Brush naan with ghee", "Serve haleem in a bowl", "Garnish with fried onions and lemon", "Tear naan and dip into hot haleem"] },
        { name: "Mutton Paye", desc: "Rich slow-cooked bone soup", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["4 mutton trotters (paye)", "2 onions (sliced)", "1 inch ginger", "6 garlic cloves", "2 bay leaves", "Cinnamon stick", "Garam masala", "Fresh ginger (julienned)"], recipe: ["Clean and wash trotters thoroughly", "Pressure cook with water for 45 minutes", "Fry onions until golden brown", "Add ginger-garlic paste and cook 2 minutes", "Add bay leaves and cinnamon", "Pour in the cooked broth and trotters", "Simmer on low heat for 30 minutes", "Garnish with ginger and serve hot"] },
        { name: "Moong Dal Khichdi", desc: "Warm rice and lentil comfort food", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=400&fit=crop", affiliateUrl: "#", ingredients: ["1 cup rice", "1/2 cup moong dal", "1 tsp turmeric", "1 tsp cumin seeds", "1 inch ginger (chopped)", "Ghee", "Salt", "4 cups water"], recipe: ["Wash rice and dal together until clean", "Heat ghee in a pot and add cumin seeds", "Add chopped ginger and saute for 30 seconds", "Add rice and dal, mix well for 1 minute", "Add turmeric and salt", "Pour water and bring to a boil", "Cover and cook on low heat for 20 minutes", "Serve hot with ghee and pickle"] }
    ]
};

const DEFAULT_TRAVEL = {
    hot: [
        { name: "Clifton Beach", desc: "Cool sea breeze and golden sand", tempC: 32, tag: "Beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Gwadar Coast", desc: "Pristine beaches and crystal clear water", tempC: 30, tag: "Coastal", image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Astola Island", desc: "Pakistan's hidden island paradise", tempC: 29, tag: "Island", image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Ormara Beach", desc: "Secluded coastal gem with turquoise water", tempC: 31, tag: "Hidden Gem", image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Sonmiani Beach", desc: "Calm waters and scenic dunes", tempC: 33, tag: "Relaxing", image: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Makran Coast", desc: "Dramatic cliffs meet the Arabian Sea", tempC: 30, tag: "Scenic", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ],
    rainy: [
        { name: "Murree Hills", desc: "Cool breezy hill station with pine forests", tempC: 18, tag: "Popular", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Abbottabad", desc: "Green valley surrounded by mountains", tempC: 20, tag: "Peaceful", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Patriata", desc: "Chairlift ride through misty hills", tempC: 17, tag: "Adventure", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Nathia Gali", desc: "Foggy trails and colonial-era charm", tempC: 15, tag: "Scenic", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Ayubia", desc: "Nature trails and butterfly museum", tempC: 16, tag: "Family", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Chitral", desc: "Remote valley with rich culture", tempC: 19, tag: "Offbeat", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ],
    cold: [
        { name: "Skardu", desc: "Land of mountains and frozen lakes", tempC: 5, tag: "Adventure", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Hunza Valley", desc: "Breathtaking peaks and ancient forts", tempC: 8, tag: "Scenic", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Naran Kaghan", desc: "Snow-capped mountains and crystal lakes", tempC: 3, tag: "Popular", image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Swat Valley", desc: "Pakistan's Switzerland in winter snow", tempC: 6, tag: "Beautiful", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Fairy Meadows", desc: "Gateway to Nanga Parbat base camp", tempC: 2, tag: "Epic", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop", affiliateUrl: "#" },
        { name: "Deosai Plains", desc: "World's second highest plateau", tempC: 0, tag: "Wildlife", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", affiliateUrl: "#" }
    ]
};

const DEFAULT_TIPS = {
    hot: {
        tips: ["UV levels are very high today — apply sunscreen", "Stay between 12PM - 4PM in shade"],
        hydration: ["Nimbu pani", "Coconut water", "Chai / lassi", "Cold homemade drinks"],
        todayPlan: ["Morning walk (early)", "Avoid 12PM - 3PM sun", "Evening stroll"],
        description: "The warm weather in your area makes for a perfect afternoon. A great day to enjoy outdoor activities or visit a cafe."
    },
    rainy: {
        tips: ["80% chance of rain — carry umbrella", "Avoid flooded roads"],
        hydration: ["Hot tea", "Masala chai", "Hot chocolate", "Warm lemon water"],
        todayPlan: ["Carry umbrella always", "Check traffic alerts", "Indoor activities recommended"],
        description: "Rain drops and cool winds call for a perfect indoor evening with warm comfort food."
    },
    cold: {
        tips: ["Temperature feels colder with wind chill", "Layer up before heading outside"],
        hydration: ["Hot coffee", "Ginger tea", "Hot soup", "Warm milk"],
        todayPlan: ["Morning gym / walk", "Warm up before going out", "Evening cozy at home"],
        description: "Chilly winds and crisp air. Perfect time to layer up and enjoy a hot cup of coffee."
    }
};

const DEFAULT_SETTINGS = {
    city: 'Peshawar',
    lat: '34.0151',
    lon: '71.5249',
    brand: 'VibeCast',
    copyright: '2024 VibeCast. All rights reserved.',
    password: DEFAULT_PASSWORD
};

// ========== STATE ==========
let currentPage = 'dashboard';
let currentOutfitTab = 'hot';
let currentFoodTab = 'hot';
let currentTravelTab = 'hot';
let currentLifestyleTab = 'hot';

// ========== localStorage HELPERS ==========
function loadData(key, fallback) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('localStorage save error:', e);
    }
}

// ========== TOAST ==========
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== AUTH ==========
function login() {
    const input = document.getElementById('login-password');
    const error = document.getElementById('login-error');
    const password = input.value.trim();
    const stored = loadData(ADMIN_PASSWORD_KEY, DEFAULT_PASSWORD);

    if (password === stored) {
        sessionStorage.setItem(AUTH_KEY, '1');
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        error.style.display = 'none';
        initDashboard();
    } else {
        error.style.display = 'block';
        input.value = '';
        input.focus();
    }
}

function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    location.reload();
}

function checkAuth() {
    if (sessionStorage.getItem(AUTH_KEY)) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        initDashboard();
    }
}

// ========== SIDEBAR TOGGLE ==========
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ========== PAGE SWITCHING ==========
function showPage(page) {
    currentPage = page;

    document.querySelectorAll('.admin-page').forEach(p => p.classList.add('hidden'));
    document.getElementById('page-' + page).classList.remove('hidden');

    document.querySelectorAll('.sidebar-link[data-page]').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    if (page === 'dashboard') updateDashboardStats();
    if (page === 'outfits') renderOutfitTable();
    if (page === 'food') renderFoodTable();
    if (page === 'travel') renderTravelTable();
    if (page === 'tips') renderLifestylePage();
    if (page === 'settings') loadSettings();

    document.getElementById('sidebar').classList.remove('open');
}

// ========== DASHBOARD ==========
function updateDashboardStats() {
    const outfits = loadData(OUTFITS_KEY, DEFAULT_OUTFITS);
    const food = loadData(FOOD_KEY, DEFAULT_FOOD);
    const travel = loadData(TRAVEL_KEY, DEFAULT_TRAVEL);
    const tips = loadData(TIPS_KEY, DEFAULT_TIPS);

    document.getElementById('stat-outfits').textContent = Object.values(outfits).flat().length;
    document.getElementById('stat-food').textContent = Object.values(food).flat().length;
    document.getElementById('stat-travel').textContent = Object.values(travel).flat().length;

    let tipCount = 0;
    Object.values(tips).forEach(cat => {
        tipCount += (cat.tips?.length || 0) + (cat.hydration?.length || 0) + (cat.todayPlan?.length || 0);
    });
    document.getElementById('stat-tips').textContent = tipCount;
}

function initDashboard() {
    updateDashboardStats();
}

// ========== MODAL ==========
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// ========== OUTFITS ==========
function switchOutfitTab(tab, btn) {
    currentOutfitTab = tab;
    document.querySelectorAll('#page-outfits .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderOutfitTable();
}

function renderOutfitTable() {
    const outfits = loadData(OUTFITS_KEY, DEFAULT_OUTFITS);
    const items = outfits[currentOutfitTab] || [];
    const tbody = document.getElementById('outfit-table-body');
    const empty = document.getElementById('outfit-empty');

    if (items.length === 0) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = items.map((item, i) => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" class="item-img" onerror="this.src='https://via.placeholder.com/48'"/></td>
            <td class="font-semibold">${item.name}</td>
            <td class="text-white/50 max-w-[200px] truncate">${item.desc}</td>
            <td class="text-primary text-xs">${item.affiliateUrl || '-'}</td>
            <td>
                <div class="list-item-actions">
                    <button class="btn-edit" onclick="editOutfit(${i})">Edit</button>
                    <button class="btn-danger" onclick="deleteOutfit(${i})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openOutfitModal(index) {
    const isEdit = index !== undefined;
    document.getElementById('outfit-modal-title').textContent = isEdit ? 'Edit Outfit' : 'Add Outfit';
    document.getElementById('outfit-edit-index').value = isEdit ? index : -1;

    if (isEdit) {
        const outfits = loadData(OUTFITS_KEY, DEFAULT_OUTFITS);
        const item = outfits[currentOutfitTab][index];
        document.getElementById('outfit-name').value = item.name;
        document.getElementById('outfit-desc').value = item.desc;
        document.getElementById('outfit-image').value = item.image;
        document.getElementById('outfit-link').value = item.affiliateUrl || '';
    } else {
        document.getElementById('outfit-name').value = '';
        document.getElementById('outfit-desc').value = '';
        document.getElementById('outfit-image').value = '';
        document.getElementById('outfit-link').value = '';
    }
    openModal('outfit-modal');
}

function editOutfit(index) {
    openOutfitModal(index);
}

function deleteOutfit(index) {
    if (!confirm('Delete this outfit item?')) return;
    const outfits = loadData(OUTFITS_KEY, DEFAULT_OUTFITS);
    outfits[currentOutfitTab].splice(index, 1);
    saveData(OUTFITS_KEY, outfits);
    renderOutfitTable();
    showToast('Outfit deleted');
}

function saveOutfit() {
    const name = document.getElementById('outfit-name').value.trim();
    const desc = document.getElementById('outfit-desc').value.trim();
    const image = document.getElementById('outfit-image').value.trim();
    const link = document.getElementById('outfit-link').value.trim();
    const editIndex = parseInt(document.getElementById('outfit-edit-index').value);

    if (!name) { alert('Name is required'); return; }

    const outfits = loadData(OUTFITS_KEY, DEFAULT_OUTFITS);
    const item = { name, desc, image: image || 'https://via.placeholder.com/500x600', affiliateUrl: link || '#' };

    if (editIndex >= 0) {
        outfits[currentOutfitTab][editIndex] = item;
    } else {
        if (!outfits[currentOutfitTab]) outfits[currentOutfitTab] = [];
        outfits[currentOutfitTab].push(item);
    }

    saveData(OUTFITS_KEY, outfits);
    closeModal('outfit-modal');
    renderOutfitTable();
    showToast(editIndex >= 0 ? 'Outfit updated' : 'Outfit added');
}

// ========== FOOD ==========
function switchFoodTab(tab, btn) {
    currentFoodTab = tab;
    document.querySelectorAll('#page-food .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderFoodTable();
}

function renderFoodTable() {
    const food = loadData(FOOD_KEY, DEFAULT_FOOD);
    const items = food[currentFoodTab] || [];
    const tbody = document.getElementById('food-table-body');
    const empty = document.getElementById('food-empty');

    if (items.length === 0) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = items.map((item, i) => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" class="item-img" onerror="this.src='https://via.placeholder.com/48'"/></td>
            <td class="font-semibold">${item.name}</td>
            <td class="text-white/50 max-w-[200px] truncate">${item.desc}</td>
            <td class="text-white/40 text-xs">${(item.ingredients || []).length} items</td>
            <td>
                <div class="list-item-actions">
                    <button class="btn-edit" onclick="editFood(${i})">Edit</button>
                    <button class="btn-danger" onclick="deleteFood(${i})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openFoodModal(index) {
    const isEdit = index !== undefined;
    document.getElementById('food-modal-title').textContent = isEdit ? 'Edit Food Item' : 'Add Food Item';
    document.getElementById('food-edit-index').value = isEdit ? index : -1;

    if (isEdit) {
        const food = loadData(FOOD_KEY, DEFAULT_FOOD);
        const item = food[currentFoodTab][index];
        document.getElementById('food-name').value = item.name;
        document.getElementById('food-desc').value = item.desc;
        document.getElementById('food-image').value = item.image;
        document.getElementById('food-ingredients').value = (item.ingredients || []).join('\n');
        document.getElementById('food-recipe').value = (item.recipe || []).join('\n');
    } else {
        document.getElementById('food-name').value = '';
        document.getElementById('food-desc').value = '';
        document.getElementById('food-image').value = '';
        document.getElementById('food-ingredients').value = '';
        document.getElementById('food-recipe').value = '';
    }
    openModal('food-modal');
}

function editFood(index) {
    openFoodModal(index);
}

function deleteFood(index) {
    if (!confirm('Delete this food item?')) return;
    const food = loadData(FOOD_KEY, DEFAULT_FOOD);
    food[currentFoodTab].splice(index, 1);
    saveData(FOOD_KEY, food);
    renderFoodTable();
    showToast('Food item deleted');
}

function saveFood() {
    const name = document.getElementById('food-name').value.trim();
    const desc = document.getElementById('food-desc').value.trim();
    const image = document.getElementById('food-image').value.trim();
    const ingredients = document.getElementById('food-ingredients').value.split('\n').map(s => s.trim()).filter(Boolean);
    const recipe = document.getElementById('food-recipe').value.split('\n').map(s => s.trim()).filter(Boolean);
    const editIndex = parseInt(document.getElementById('food-edit-index').value);

    if (!name) { alert('Name is required'); return; }

    const food = loadData(FOOD_KEY, DEFAULT_FOOD);
    const item = { name, desc, image: image || 'https://via.placeholder.com/500x400', affiliateUrl: '#', ingredients, recipe };

    if (editIndex >= 0) {
        food[currentFoodTab][editIndex] = item;
    } else {
        if (!food[currentFoodTab]) food[currentFoodTab] = [];
        food[currentFoodTab].push(item);
    }

    saveData(FOOD_KEY, food);
    closeModal('food-modal');
    renderFoodTable();
    showToast(editIndex >= 0 ? 'Food item updated' : 'Food item added');
}

// ========== TRAVEL ==========
function switchTravelTab(tab, btn) {
    currentTravelTab = tab;
    document.querySelectorAll('#page-travel .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTravelTable();
}

function renderTravelTable() {
    const travel = loadData(TRAVEL_KEY, DEFAULT_TRAVEL);
    const items = travel[currentTravelTab] || [];
    const tbody = document.getElementById('travel-table-body');
    const empty = document.getElementById('travel-empty');

    if (items.length === 0) {
        tbody.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    tbody.innerHTML = items.map((item, i) => `
        <tr>
            <td><img src="${item.image}" alt="${item.name}" class="item-img" onerror="this.src='https://via.placeholder.com/48'"/></td>
            <td class="font-semibold">${item.name}</td>
            <td class="text-white/50 max-w-[200px] truncate">${item.desc}</td>
            <td>${item.tempC}°C</td>
            <td class="text-xs">${item.tag}</td>
            <td>
                <div class="list-item-actions">
                    <button class="btn-edit" onclick="editTravel(${i})">Edit</button>
                    <button class="btn-danger" onclick="deleteTravel(${i})">Delete</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openTravelModal(index) {
    const isEdit = index !== undefined;
    document.getElementById('travel-modal-title').textContent = isEdit ? 'Edit Destination' : 'Add Destination';
    document.getElementById('travel-edit-index').value = isEdit ? index : -1;

    if (isEdit) {
        const travel = loadData(TRAVEL_KEY, DEFAULT_TRAVEL);
        const item = travel[currentTravelTab][index];
        document.getElementById('travel-name').value = item.name;
        document.getElementById('travel-desc').value = item.desc;
        document.getElementById('travel-temp').value = item.tempC;
        document.getElementById('travel-tag').value = item.tag;
        document.getElementById('travel-image').value = item.image;
        document.getElementById('travel-link').value = item.affiliateUrl || '';
    } else {
        document.getElementById('travel-name').value = '';
        document.getElementById('travel-desc').value = '';
        document.getElementById('travel-temp').value = '';
        document.getElementById('travel-tag').value = '';
        document.getElementById('travel-image').value = '';
        document.getElementById('travel-link').value = '';
    }
    openModal('travel-modal');
}

function editTravel(index) {
    openTravelModal(index);
}

function deleteTravel(index) {
    if (!confirm('Delete this destination?')) return;
    const travel = loadData(TRAVEL_KEY, DEFAULT_TRAVEL);
    travel[currentTravelTab].splice(index, 1);
    saveData(TRAVEL_KEY, travel);
    renderTravelTable();
    showToast('Destination deleted');
}

function saveTravel() {
    const name = document.getElementById('travel-name').value.trim();
    const desc = document.getElementById('travel-desc').value.trim();
    const tempC = parseInt(document.getElementById('travel-temp').value) || 25;
    const tag = document.getElementById('travel-tag').value.trim();
    const image = document.getElementById('travel-image').value.trim();
    const link = document.getElementById('travel-link').value.trim();
    const editIndex = parseInt(document.getElementById('travel-edit-index').value);

    if (!name) { alert('Name is required'); return; }

    const travel = loadData(TRAVEL_KEY, DEFAULT_TRAVEL);
    const item = { name, desc, tempC, tag: tag || 'Popular', image: image || 'https://via.placeholder.com/600x400', affiliateUrl: link || '#' };

    if (editIndex >= 0) {
        travel[currentTravelTab][editIndex] = item;
    } else {
        if (!travel[currentTravelTab]) travel[currentTravelTab] = [];
        travel[currentTravelTab].push(item);
    }

    saveData(TRAVEL_KEY, travel);
    closeModal('travel-modal');
    renderTravelTable();
    showToast(editIndex >= 0 ? 'Destination updated' : 'Destination added');
}

// ========== LIFESTYLE / TIPS ==========
function switchLifestyleTab(tab, btn) {
    currentLifestyleTab = tab;
    document.querySelectorAll('#page-tips .tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderLifestylePage();
}

function renderLifestylePage() {
    const tips = loadData(TIPS_KEY, DEFAULT_TIPS);
    const cat = tips[currentLifestyleTab] || { tips: [], hydration: [], todayPlan: [], description: '' };

    renderListItems('tips-list', cat.tips || [], 'tips');
    renderListItems('hydration-list-admin', cat.hydration || [], 'hydration');
    renderListItems('today-list-admin', cat.todayPlan || [], 'todayPlan');
    document.getElementById('lifestyle-description').value = cat.description || '';
}

function renderListItems(containerId, items, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = items.map((item, i) => `
        <div class="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/[0.03]">
            <span class="text-xs text-white/70 flex-1 truncate">${item}</span>
            <div class="list-item-actions">
                <button class="btn-edit text-[10px] px-2 py-1" onclick="editListItem('${type}', ${i})">Edit</button>
                <button class="btn-danger text-[10px] px-2 py-1" onclick="deleteListItem('${type}', ${i})">Del</button>
            </div>
        </div>
    `).join('');
}

function addItemToList(type) {
    document.getElementById('list-edit-index').value = -1;
    document.getElementById('list-type').value = type;
    document.getElementById('list-item-text').value = '';
    const titles = { tips: 'Add Tip', hydration: 'Add Hydration Item', todayPlan: 'Add Plan Item' };
    document.getElementById('list-modal-title').textContent = titles[type] || 'Add Item';
    openModal('list-modal');
}

function editListItem(type, index) {
    const tips = loadData(TIPS_KEY, DEFAULT_TIPS);
    const cat = tips[currentLifestyleTab];
    const item = cat[type][index];

    document.getElementById('list-edit-index').value = index;
    document.getElementById('list-type').value = type;
    document.getElementById('list-item-text').value = item;
    const titles = { tips: 'Edit Tip', hydration: 'Edit Hydration Item', todayPlan: 'Edit Plan Item' };
    document.getElementById('list-modal-title').textContent = titles[type] || 'Edit Item';
    openModal('list-modal');
}

function deleteListItem(type, index) {
    if (!confirm('Delete this item?')) return;
    const tips = loadData(TIPS_KEY, DEFAULT_TIPS);
    tips[currentLifestyleTab][type].splice(index, 1);
    saveData(TIPS_KEY, tips);
    renderLifestylePage();
    showToast('Item deleted');
}

function saveListItem() {
    const text = document.getElementById('list-item-text').value.trim();
    const index = parseInt(document.getElementById('list-edit-index').value);
    const type = document.getElementById('list-type').value;

    if (!text) { alert('Text is required'); return; }

    const tips = loadData(TIPS_KEY, DEFAULT_TIPS);
    if (!tips[currentLifestyleTab]) {
        tips[currentLifestyleTab] = { tips: [], hydration: [], todayPlan: [], description: '' };
    }
    if (!tips[currentLifestyleTab][type]) tips[currentLifestyleTab][type] = [];

    if (index >= 0) {
        tips[currentLifestyleTab][type][index] = text;
    } else {
        tips[currentLifestyleTab][type].push(text);
    }

    saveData(TIPS_KEY, tips);
    closeModal('list-modal');
    renderLifestylePage();
    showToast(index >= 0 ? 'Item updated' : 'Item added');
}

function saveLifestyleDescription() {
    const desc = document.getElementById('lifestyle-description').value.trim();
    const tips = loadData(TIPS_KEY, DEFAULT_TIPS);
    if (!tips[currentLifestyleTab]) {
        tips[currentLifestyleTab] = { tips: [], hydration: [], todayPlan: [], description: '' };
    }
    tips[currentLifestyleTab].description = desc;
    saveData(TIPS_KEY, tips);
    showToast('Description saved');
}

// ========== SETTINGS ==========
function loadSettings() {
    const settings = loadData(SETTINGS_KEY, DEFAULT_SETTINGS);
    document.getElementById('setting-city').value = settings.city || '';
    document.getElementById('setting-lat').value = settings.lat || '';
    document.getElementById('setting-lon').value = settings.lon || '';
    document.getElementById('setting-brand').value = settings.brand || '';
    document.getElementById('setting-copyright').value = settings.copyright || '';
    document.getElementById('setting-password').value = '';
}

function saveSettings() {
    const settings = {
        city: document.getElementById('setting-city').value.trim(),
        lat: document.getElementById('setting-lat').value.trim(),
        lon: document.getElementById('setting-lon').value.trim(),
        brand: document.getElementById('setting-brand').value.trim(),
        copyright: document.getElementById('setting-copyright').value.trim(),
    };

    const newPassword = document.getElementById('setting-password').value.trim();
    if (newPassword) {
        settings.password = newPassword;
        saveData(ADMIN_PASSWORD_KEY, newPassword);
    } else {
        settings.password = loadData(ADMIN_PASSWORD_KEY, DEFAULT_PASSWORD);
    }

    saveData(SETTINGS_KEY, settings);
    showToast('Settings saved');
}

// ========== BACKUP / EXPORT / IMPORT ==========
function exportData() {
    const allData = {
        outfits: loadData(OUTFITS_KEY, DEFAULT_OUTFITS),
        food: loadData(FOOD_KEY, DEFAULT_FOOD),
        travel: loadData(TRAVEL_KEY, DEFAULT_TRAVEL),
        tips: loadData(TIPS_KEY, DEFAULT_TIPS),
        settings: loadData(SETTINGS_KEY, DEFAULT_SETTINGS),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibecast-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data exported successfully');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.outfits) saveData(OUTFITS_KEY, data.outfits);
            if (data.food) saveData(FOOD_KEY, data.food);
            if (data.travel) saveData(TRAVEL_KEY, data.travel);
            if (data.tips) saveData(TIPS_KEY, data.tips);
            if (data.settings) {
                saveData(SETTINGS_KEY, data.settings);
                if (data.settings.password) saveData(ADMIN_PASSWORD_KEY, data.settings.password);
            }
            showToast('Data imported successfully');
            showPage(currentPage);
        } catch (err) {
            alert('Invalid JSON file: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetAllData() {
    if (!confirm('This will DELETE all your custom data and restore defaults. Are you sure?')) return;
    if (!confirm('Final confirmation: Reset everything?')) return;

    localStorage.removeItem(OUTFITS_KEY);
    localStorage.removeItem(FOOD_KEY);
    localStorage.removeItem(TRAVEL_KEY);
    localStorage.removeItem(TIPS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(ADMIN_PASSWORD_KEY);

    showToast('All data reset to defaults');
    showPage(currentPage);
}

// ========== KEYBOARD ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
});

// Enter to login
const loginInput = document.getElementById('login-password');
if (loginInput) {
    loginInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });
}

// ========== INIT ==========
checkAuth();
