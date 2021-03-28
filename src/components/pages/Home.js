import React from 'react';
import { Link } from 'react-router-dom';
import useData from '/src/hooks/useData';


function Home() {
	const users = useData('usersList');
	return (
		<>
			<div className="container">
				<div className="section">
					<div className="block has-text-centered">
						<h1 className="title">Users list</h1>
						{!users &&
							<h2 className="subtitle">
								Loading...
							</h2>
						}
						{users && users.length < 1 &&
							<h2 className="subtitle">
								There are no users registered yet.
								You can start by <Link to="/register">creating your own account</Link>.
							</h2>
						}
					</div>
					{users && users.length > 0 &&
						<div className="row columns is-multiline">
							{users.map(user => {
								const displayName = `${user.firstName} ${user.lastName || ""}`;
								const userLink = `/users/${user.id}`;
								return (
									<div key={user.id} className="column is-4">
										<div className="card large">
											<div className="card-image">
												<figure className="image is-4by3">
													<img src={user.picture} alt="Image" title={displayName} />
												</figure>
											</div>
											<div className="card-content">
												<div className="media">
													<div className="media-content">
														<h2 className="title is-4 no-padding">
															<Link to={userLink}>{displayName}</Link>
														</h2>
														<h3 className="subtitle is-6">{user.status}&nbsp;</h3>
													</div>
												</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					}
				</div>
			</div>
		</>
	);
}

export default Home;
