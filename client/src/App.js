import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_BOOKS = gql`
	{
		books {
			_id
			title
			author
		}
	}
`;

class App extends Component {

	render() {
		return (
			<Query pollInterval={500} query={GET_BOOKS}>
				{({ loading, error, data }) => {
					if (loading) return 'Loading...';
					if (error) return `Error! ${error.message}`;
					return (
						<div className="container">
							<div className="panel panel-default">
								<div className="panel-heading">
									<h3 className="panel-title text-center mt-3 alert alert-primary">
										LIST OF BOOKS
									</h3>
									<h4><Link to="/create" className='btn btn-primary'>Add New Book</Link></h4>
								</div>
								<div className="panel-body">
									<table className="table table-stripe table-bordered">
										<thead className='table-dark'>
											<tr>
												<th>Title</th>
												<th>Author</th>
											</tr>
										</thead>
										<tbody>
											{data.books.map((book, index) => (
												<tr key={index}>
													<td><Link className='links-dec' to={`/show/${book._id}`}>{book.title}</Link></td>
													<td>{book.author}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					);
				}}
			</Query>
		);
	}
}

export default App;
