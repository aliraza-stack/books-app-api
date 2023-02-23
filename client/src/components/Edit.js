import React, { Component } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

const GET_BOOK = gql`
  query book($bookId: String) {
    book(id: $bookId) {
      _id
      isbn
      title
      author
      description
      published_year
      publisher
      updated_date
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation updateBook(
    $id: String!
    $isbn: String!
    $title: String!
    $author: String!
    $description: String!
    $publisher: String!
    $published_year: Int!
  ) {
    updateBook(
      id: $id
      isbn: $isbn
      title: $title
      author: $author
      description: $description
      publisher: $publisher
      published_year: $published_year
    ) {
      updated_date
    }
  }
`;

class Edit extends Component {
  render() {
    let isbn, title, author, description, published_year, publisher;
    return (
      <Query
        query={GET_BOOK}
        variables={{ bookId: this.props.match.params.id }}
      >
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
          return (
            <Mutation
              mutation={UPDATE_BOOK}
              key={data.book._id}
              onCompleted={() => this.props.history.push(`/`)}
            >
              {(updateBook, { loading, error }) => (
                <div className="container">
                  <div className="card mt-3">
                    <div className="card-header">
                    <div className="row justify-content-between align-items-center">
                      <h3 className="card-title">EDIT BOOK</h3>
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
                          updateBook({
                            variables: {
                              id: data.book._id,
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
                          <label htmlFor="isbn" className="form-label">ISBN:</label>
                          <input type="text" className="form-control" name="isbn" ref={(node) => {isbn = node;}} placeholder="ISBN"
                            defaultValue={data.book.isbn}
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
                            defaultValue={data.book.title}
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
                            defaultValue={data.book.author}
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
                            defaultValue={data.book.description}
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
                            defaultValue={data.book.publisher}
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="published_year"
                            className="form-label"
                          >
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
                            defaultValue={data.book.published_year}
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
        }}
      </Query>
    );
  }
}

export default Edit;
