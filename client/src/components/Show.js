import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';

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

// list of comments
const GET_BOOK_COMMENTS = gql`
  query GetBookComments($bookId: ID!) {
    book(id: $bookId) {
      id
      title
      author
      comments {
        id
        text
        createdAt
      }
    }
  }
`;


const DELETE_BOOK = gql`
  mutation removeBook($id: String!) {
	removeBook(id:$id) {
	  _id
	}
  }
`;

// create comment mutation
const ADD_COMMENT = gql`
  mutation CreateComment($text: String!, $bookId: ID!) {
  createComment(text: $text, bookId: $bookId) {
    _id
    text
    book {
      _id
      title
    }
    createdAt
  }
}
`;

class Show extends Component {

render() {
	return (
		<Query pollInterval={500} query={GET_BOOK} variables={{ bookId: this.props.match.params.id }}>
			{({ loading, error, data }) => {
				if (loading) return <div className="container my-5"><h3>Loading...</h3></div>;
				if (error) return <div className="container my-5"><h3>Error! {error.message}</h3></div>;
				return (
					<div className="container my-5">
					<h1 className='text-center alert alert-primary'>Book Detail</h1>
						<div className="card">
							<div className="card-header">
								<h4 className="card-title">
									<Link to="/">List of Books</Link>
								</h4>
								<h3 className="card-title">
									{data.book.title}
								</h3>
							</div>
							<div className="card-body">
								<dl className="row">
									<dt className="col-sm-3">ISBN:</dt>
									<dd className="col-sm-9">{data.book.isbn}</dd>
									<dt className="col-sm-3">Author:</dt>
									<dd className="col-sm-9">{data.book.author}</dd>
									<dt className="col-sm-3">Description:</dt>
									<dd className="col-sm-9">{data.book.description}</dd>
									<dt className="col-sm-3">Published Year:</dt>
									<dd className="col-sm-9">{data.book.published_year}</dd>
									<dt className="col-sm-3">Publisher:</dt>
									<dd className="col-sm-9">{data.book.publisher}</dd>
									<dt className="col-sm-3">Updated:</dt>
									<dd className="col-sm-9">{data.book.updated_date}</dd>
								</dl>
								<Mutation mutation={DELETE_BOOK} key={data.book._id} onCompleted={() => this.props.history.push('/')}>
									{(removeBook, { loading, error }) => (
										<div>
											<form
												onSubmit={e => {
													e.preventDefault();
													removeBook({ variables: { id: data.book._id } });
												}}>
												<Link to={`/edit/${data.book._id}`} className="btn btn-success me-2">Edit</Link>
												<button type="submit" className="btn btn-danger mx-3">Delete</button>
											</form>
											{loading && <p>Loading...</p>}
											{error && <p>Error :( Please try again</p>}
										</div>
									)}
								</Mutation>
							</div>
						</div>

						{/* Lsit of comments */}
						<div className="card mt-3">
							<div className="card-header">
								<h3 className="card-title">Comments</h3>
							</div>
							<div className="card-body">
								<Query query={GET_BOOK_COMMENTS} variables={{ bookId: this.props.match.params.id }}>
									{({ loading, error, data }) => {
										if (loading) return <div className="container my-5"><h3>Loading...</h3></div>;
										if (error) return <div className="container my-5"><h3>Error! {error.message}</h3></div>;
										if (!data.comments.length) return <div className="container my-5"><h3>No comments yet.</h3></div>
										return (
											<div className="card">
												<div className="card-body">
													{data.comments.map(comment => (
														<div key={comment._id}>
															<p>{comment.text}</p>
															<p>{comment.createdAt}</p>
														</div>
													))}
												</div>
											</div>
										);
									}}
								</Query>
							</div>
						</div>




						<div className="card mt-3">
							<div className="card-header">
								<h3 className="card-title">Comments</h3>
								<Mutation
									mutation={ADD_COMMENT}
									update={(cache, { data: { createComment } }) => {
									const { book } = cache.readQuery({ query: GET_BOOK, variables: { bookId: this.props.match.params.id } });
										cache.writeQuery({
											query: GET_BOOK,
											variables: { bookId: this.props.match.params.id },
											data: { book: book.concat([createComment]) },
										});
									}}>
									{createComment => (
										<form
											onSubmit={e => {
												e.preventDefault();
												createComment({
													variables: { text: this.text.value, bookId: data.book._id }
												});
												this.text.value = '';
											}}>
											<div className="form-group">
												<label htmlFor="text">Comment:</label>
												<input type="text" className="form-control" name="text" ref={node => {
													this.text = node;
												}} placeholder="Enter comment" />
											</div>
											<button type="submit" className="btn btn-success">Submit</button>
										</form>
									)}
								</Mutation>
							</div>
						</div>
					</div>
				);
			}}
		</Query>
	);
}
}

export default Show;