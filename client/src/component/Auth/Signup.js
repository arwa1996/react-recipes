import React from "react";
import { Mutation } from "react-apollo";
import { withRouter } from "react-router-dom";
import Error from "../Error";
import { SIGNUP_USER } from "../../queries/";

const initialState = {
  username: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

class Signup extends React.Component {
  state = {
    ...initialState,
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  clearState = () => {
    this.setState({ ...initialState });
  };

  handleSubmit = (event, signupUser) => {
    event.preventDefault();
    signupUser().then(async ({ data }) => {
      console.log(data);
      localStorage.setItem("token", data.signupUser.token);
      await this.props.refetch();
      this.clearState();
      this.props.history.push("/");
    });
  };

  validateForm = () => {
    const { username, email, password, passwordConfirmation } = this.state;
    const isInvalid =
      !username ||
      !email ||
      !password ||
      !passwordConfirmation ||
      password !== passwordConfirmation;
    return isInvalid;
  };

  render() {
    const { username, email, password, passwordConfirmation } = this.state;
    return (
      <div className="App">
        <h2 className="App">Signup</h2>
        <Mutation
          mutation={SIGNUP_USER}
          variables={{ username, email, password }}
        >
          {(signupUser, { data, loading, error }) => {
            return (
              <form
                className="form"
                onSubmit={(event) => this.handleSubmit(event, signupUser)}
              >
                <input
                  type="text"
                  name="username"
                  placeholder="user"
                  value={username}
                  onChange={this.handleChange}
                />
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="Email"
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={this.handleChange}
                />
                <input
                  type="password"
                  value={passwordConfirmation}
                  name="passwordConfirmation"
                  placeholder="Confirm Password"
                  onChange={this.handleChange}
                />
                <button
                  type="submit"
                  className="button-primary"
                  disabled={loading || this.validateForm()}
                >
                  Submit
                </button>
                {error && <Error error={error} />}
              </form>
            );
          }}
        </Mutation>
      </div>
    );
  }
}

export default withRouter(Signup);
