import React, { useState, useEffect } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/helper";
import { getAllProducts, deleteProduct } from "./helper/adminapicall";
import Loading from "../core/Loading";
import ErrorToast from "../core/ErrorToast";

const ManageProduct = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const { user, token } = isAuthenticated();

	const preload = () => {
		setLoading(true);
		getAllProducts().then((data) => {
			setLoading(false);
			if (data.error) {
				setError(data.error);
				console.log(data.error);
			} else {
				setProducts(data);
			}
		});
	};

	useEffect(() => {
		preload();
	}, []);

	const deleteThisProduct = (productId) => {
		setLoading(true);
		deleteProduct(user._id, productId, token)
		.then((data) => {
				setLoading(false);
				if (data.error) {
					console.log(data.error);
					setError(data.error);
				} else {
					preload();
				}
			})
			.catch((err) => {
				setLoading(false);
				setError(err);
				console.log(err)
			});
	};

	const showProducts = () => {
		return products.map((product, index) => {
			return (
				<div key={index}>
					<div className="row text-center text-muted">
						<div className="col-8 pl-5">
							<h4 className="text-left" style={{ textTransform: "capitalize" }}>
								{product.name}
							</h4>
						</div>
						<div className="col-2">
							<Link
								className="btn btn-success rounded"
								to={`/admin/product/update/${product._id}`}
							>
								<span className="">Update</span>
							</Link>
						</div>
						<div className="col-2">
							<button
								onClick={() => {
									deleteThisProduct(product._id);
								}}
								className="btn btn-danger rounded"
							>
								Delete
							</button>
						</div>
					</div>
					<hr />
				</div>
			);
		});
	};

	return (
		<Base
			title="Manage Product Page"
			description="Manage products here"
			className="container bg-white rounded p-4"
		>
			<Link className="btn btn-info rounded" to={`/admin/dashboard`}>
				<span className="">Admin Home</span>
			</Link>
			<h2 className="mb-4 text-center">All Products</h2>
			<Loading loading={loading} />
			<ErrorToast error={error} />
			<div className="row">
				<div className="col-12">
					<h4 className="text-left text-warning my-3">
						Total Products: {products.length}
					</h4>
					{showProducts()}
				</div>
			</div>
		</Base>
	);
};

export default ManageProduct;
