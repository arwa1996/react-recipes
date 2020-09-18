import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import { ADD_RECIPE, GET_ALL_RECIPES } from "../../queries";

const initialState = {
  name: "",
  instructions: "",
  category: "",
  description: "",
  username: "",
};

class AddRecipe extends React.Component {
  state = {
    ...initialState,
  };

  componentDidMount() {
    this.setState({
      // username: this.props.session.getCurrentUser.username,
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      console.log(data);
      this.clearState();
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { name, category, description, instructions, username } = this.state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  };

  updateCache = (cache, { data: { addRecipe } }) => {
    const { getALLRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    console.log("read query", getALLRecipes);
    console.log("from data", addRecipe);

    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getALLRecipes: getALLRecipes.concat([addRecipe]),
      },
    });
  };

  render() {
    const { name, category, description, instructions, username } = this.state;
    return (
      <Mutation
        mutation={ADD_RECIPE}
        variables={{ name, category, description, instructions, username }}
        update={this.updateCache}
      >
        {(addRecipe, { data, loading, error }) => {
          return (
            <div className="App">
              <h2 className="App">AddRecipe</h2>
              <form
                className="form"
                onSubmit={(event) => this.handleSubmit(event, addRecipe)}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Recipe Name"
                  onChange={this.handleChange}
                  value={name}
                />
                <select
                  name="category"
                  onChange={this.handleChange}
                  value={category}
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Breakfast">lunch</option>
                  <option value="Breakfast">Dinner</option>
                  <option value="Breakfast">snack</option>
                </select>
                <input
                  type="text"
                  name="description"
                  placeholder="Add description"
                  onChange={this.handleChange}
                  value={description}
                />
                <textarea
                  name="instructions "
                  placeholder="Add instructions"
                  onChange={this.handleChange}
                  value={instructions}
                />
                <button
                  disabled={loading || this.validateForm()}
                  type="submit"
                  className="button-primary"
                >
                  Submit
                </button>
                {error && console.log(error)}
              </form>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(AddRecipe);
