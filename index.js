const mongoose = require("mongoose");
const Recipe = require("./models/Recipe.model");
const data = require("./data");

const MONGODB_URI = "mongodb://localhost:27017/recipe-app";

mongoose.set("useFindAndModify", false);
mongoose.set("debug", true);

mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })

  .then((self) => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    return self.connection.dropDatabase();
  })

  .then(() => {
    return Recipe.create(recipeObj).then((results) =>
      console.log(`Saved new recipe: ${results.title}`)
    );
  })
  .then(() => {
    return Recipe.insertMany(data).then((results) => {
      results.forEach((result) => {
        console.log(result.title);
      });
    });
  })
  .then(() => {
    Recipe.findOneAndUpdate(
      {
        title: "Rigatoni alla Genovese",
      },
      {
        duration: 100,
      }
    ).then((results) => console.log(`Recipe Updated`));
  })
  .then(() => {
    Recipe.deleteOne({
      title: "Carrot Cake",
    }).then((results) => console.log(`Recipe Deleted`));
  })
  .then(() => {
    process.on("SIGINT", () => {
      mongoose.connection.close(() => {
        console.log(`Mongo connection closed`);
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

const recipeObj = {
  title: "Aglio e Olio",
  level: "Amateur Chef",
  ingredients: [
    "1 tablespoon Oil",
    "1 crushed garlic clove",
    "Lemon",
    "1 teaspoon Chilli Flakes",
    "200g Linguine",
  ],
  cuisine: "Italian",
  dishType: "main_course",
  image:
    "https://theplantbasedschool.com/wp-content/uploads/2020/06/Pasta-aglio-olio-e-peperoncino.jpg",
  duration: 15,
  creator: "Chef Emma",
  created: new Date(),
};
