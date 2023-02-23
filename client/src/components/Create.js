import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from "react-router-dom";

const ADD_BOOK = gql`
  mutation AddBook(
    $isbn: String!
    $title: String!
    $author: String!
    $description: String!
    $publisher: String!
    $published_year: Int!
  ) {
    addBook(
      isbn: $isbn
      title: $title
      author: $author
      description: $description
      publisher: $publisher
      published_year: $published_year
    ) {
      _id
    }
  }
`;

class Create extends Component {
  render() {
    let isbn, title, author, description, published_year, publisher;
    return (
      <Mutation
        mutation={ADD_BOOK}
        onCompleted={() => this.props.history.push("/")}
      >
        {(addBook, { loading, error }) => (
          <div className="container">
            <div className="card mt-3">
              <div className="card-header">
                <div className="row justify-content-between align-items-center">
                  <h3 className="card-title">ADD BOOK</h3>
                  <h4 className="">
                    <Link to="/" className="btn btn-primary mb-3">
                      Back to Book List
                    </Link>
                  </h4>
                </div>
              </div>
              <div className="card-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addBook({
                      variables: {
                        isbn: isbn.value,
                        title: title.value,
                        author: author.value,
                        description: description.value,
                        publisher: publisher.value,
                        published_year: parseInt(published_year.value),
                      },
                    });
                    isbn.value = "";
                    title.value = "";
                    author.value = "";
                    description.value = "";
                    publisher.value = null;
                    published_year.value = "";
                  }}
                >
                  <div className="mb-3">
                    <label htmlFor="isbn" className="form-label">
                      ISBN:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="isbn"
                      ref={(node) => {
                        isbn = node;
                      }}
                      placeholder="ISBN"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      ref={(node) => {
                        title = node;
                      }}
                      placeholder="Title"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="author" className="form-label">
                      Author:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="author"
                      ref={(node) => {
                        author = node;
                      }}
                      placeholder="Author"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description:
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      ref={(node) => {
                        description = node;
                      }}
                      placeholder="Description"
                      cols="80"
                      rows="3"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="publisher" className="form-label">
                      Publisher:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="publisher"
                      ref={(node) => {
                        publisher = node;
                      }}
                      placeholder="Publisher"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="published_year" className="form-label">
                      Published Year:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="published_year"
                      ref={(node) => {
                        published_year = node;
                      }}
                      placeholder="Published Year"
                    />
                  </div>
                  <button type="submit" className="btn btn-success me-2">
                    Submit
                  </button>
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  {error && (
                    <div className="alert alert-danger">
                      Error :( Please try again
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

export default Create;
