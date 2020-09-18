import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./index.css";
import App from "./component/App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Signin from "./component/Auth/Signin";
import Signup from "./component/Auth/Signup";
import withSession from "./component/withSession";
import Navbar from "./component/Navbar";
import Search from "./component/Recipe/Search";
import AddRecipe from "./component/Recipe/AddRecipe";
import Profile from "./component/Profile/Profile";
import RecipePage from "./component/Recipe/RecipePage";

const client = new ApolloClient({
  uri: "http://localhost:4444/graphql",
  //send our local token to back-end
  fetchOptions: {
    credentials: "include",
  },
  request: (operation) => {
    const token = localStorage.getItem("token");
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },

  onError: ({ networkError }) => {
    if (networkError) {
      console.log("network error", networkError);
    }
  },
});

const Root = ({ refetch, session }) => (
  <Router>
    <Fragment>
      <Navbar session={session} />
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/search" exact component={Search} />
        <Route path="/signin" render={() => <Signin refetch={refetch} />} />
        <Route
          path="/signup"
          exact
          render={() => <Signup refetch={refetch} />}
        />
        <Route
          path="/recipe/add"
          render={() => <AddRecipe session={session} />}
        />
        <Route path="/profile" component={Profile} />

        <Route path="/recipes/:_id" component={RecipePage} />

        <Redirect to="/" />
      </Switch>
    </Fragment>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <ApolloProvider client={client}>
    <RootWithSession />
  </ApolloProvider>,

  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
