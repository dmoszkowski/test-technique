import React, {useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import useData from '/src/hooks/useData';
import editProfileFormConfig from '/src/formConfigs/editProfileForm';
import Form from '/src/components/Form';


function User() {
	const [editProfile, setEditProfile] = useState(false);
	const params = useParams();
	const user = useData(`userDetails/${params.id}`) || {};
	const displayName = `${user.firstName} ${user.lastName || ""}`;
	return (
		<>
			<div className="container has-text-centered">
				<div className="section">
					<div className="level">
						<div className="level-left">
							<Link to="/" className="button is-primary">
								<span className="icon">
									<i className="fas fa-chevron-left"></i>
								</span>
								<span>Back to user list</span>
							</Link>
						</div>
						{user.isCurrentUser &&
							<div className="level-right">
								<button type="button" className="button is-link" onClick={()=>setEditProfile(true)}>
									<span className="icon">
										<i className="fas fa-user-edit"></i>
									</span>
									<span>Edit profile</span>
								</button>
							</div>
						}
					</div>
					<div className="columns is-vcentered">
						<div className="column is-5">
							<figure className="image is-4by3">
								<img className="user-picture" src={user.picture} alt="Image" title={displayName} />
							</figure>
						</div>
						<div className="column is-6 is-offset-1">
							<h1 className="title is-2">
								{displayName}
							</h1>
							<h2 className="subtitle is-4">
								{user.status}
							</h2>
							<a href={`mailto:${user.email}`} className="subtitle has-text-link is-6">
								<span className="icon-text">
									<span className="icon">
										<i className="fas fa-envelope"></i>
									</span>
									<span>{user.email}</span>
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>
			<div className="section" />
			{user.isCurrentUser && editProfile &&
				<div className="modal is-active">
					<div className="modal-background" onClick={()=>setEditProfile(false)}></div>
					<div className="modal-content">
						<div className="box">
							<Form action="/editProfile" method="post" config={editProfileFormConfig} onCancel={()=>setEditProfile(false)} initialValues={user} />
						</div>
					</div>
					<button type="button" className="modal-close is-large" aria-label="close" onClick={()=>setEditProfile(false)}></button>
				</div>
			}
		</>
	);
}

export default User;
