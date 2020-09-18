const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (root, args, { Recipe }) => {
      const allRecipe = await Recipe.find().sort({
        createdData: "desc",
      });
      return allRecipe;
    },

    getRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOne({ _id });
      return recipe;
    },

    getRecipe: async (root, { _id }, { Recipe }) => {
      const recipe = await Recipe.findOne({ _id });
      return recipe;
    },

    searchRecipes: async (root, { searchTerm }, Recipe) => {
      if (searchTerm) {
        //search
        const searchResults = await Recipe.find(
          {
            $text: { $search: searchTerm },
          },
          {
            score: { $meta: "textScore" },
          }
        ).sort({
          score: { $meta: "textScore" },
        });
        return searchResults;
      } else {
        const recipes = await Recipe.find().sort({
          likes: "desc",
          createdData: "desc",
        });
        return recipes;
      }
    },

    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username,
      }).populate({
        path: "favorites",
        model: "Recipe",
      });

      return user;
    },
  },

  Mutation: {
    addRecipe: async (
      root,
      { name, description, category, instructions, username },
      { Recipe }
    ) => {
      try {
        const newRecipe = await new Recipe({
          name,
          description,
          category,
          instructions,
          username,
        }).save();

        console.log(newRecipe);
        return newRecipe;
      } catch (err) {
        console.log(err);
      }
    },

    signinUser: async (root, { username, password }, { User }) => {
      //see if the user already exists or not
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("user not found");
      }
      //check password with the token
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid Password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },
    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exists");
      }
      const newUser = await new User({
        username,
        email,
        password,
      }).save();
      return { token: createToken(newUser, process.env.SECRET, "1hr") };
    },
  },
};
