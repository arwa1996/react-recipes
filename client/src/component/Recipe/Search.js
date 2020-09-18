import React from "react";

import { Query, renderToStringWithData } from "react-apollo";
import { SEARCH_RECIPES } from "../../queries";
import { ApolloConsumer } from "react-apollo";
import SearchItem from "./SearchItem";

class Search extends React.Component {
  state = {
    searchResults: [],
  };

  handleChange = ({ SearchRecipes }) => {
    this.setState({
      searchResults: SearchRecipes,
    });
  };

  render() {
    const { searchResults } = this.state;
    return (
      <ApolloConsumer>
        {() => (
          <Query query={SEARCH_RECIPES} variables={{ searchTerm: "" }}>
            {({ data, loading, error }) => {
              if (loading) return <div>Loading</div>;
              if (error) return <div>error</div>;
              console.log(data);
              return (
                <div>
                  <input
                    type="search"
                    placeholder="Search for Recipes"
                    onChange={async (event) => {
                      event.persist();
                      const { data } = await client.query({
                        query: SEARCH_RECIPES,
                        variables: { searchTerm },
                      });
                      this.handleChange(data);
                    }}
                  />
                  <ul>
                    {searchResults.map((recipe) => (
                      <SearchItem key={recipe._id} {...recipe} />
                    ))}
                  </ul>
                </div>
              );
            }}
          </Query>
        )}
      </ApolloConsumer>
    );
  }
}

export default Search;
