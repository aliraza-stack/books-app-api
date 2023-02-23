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

const DELETE_BOOK = gql`
  mutation removeBook($id: String!) {
	removeBook(id:$id) {
	  _id
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
					</div>
				);
			}}
		</Query>
	);
}
}

export default Show;