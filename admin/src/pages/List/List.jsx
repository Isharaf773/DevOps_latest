import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaTimes, FaSave, FaUpload } from 'react-icons/fa';

const List = ({url}) => {
  const[list,setList]=useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchList = async ()=>{
    const response = await axios.get(`${url}/api/food/list`);
    
    if(response.data.success){
      setList(response.data.data);
    }else{
      toast.error("Error");
    }
  }

  const removeFood = async(foodId)=>{
    if(!window.confirm('Are you sure you want to delete this food item?')){
      return;
    }
    
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId});
    await fetchList();
    if(response.data.success){
      toast.success(response.data.message);
    }
    else{
      toast.error("Error.");
    }
  }

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
    setImagePreview(`${url}/images/${item.image}`);
    setEditImage(null);
  }

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      description: '',
      price: '',
      category: ''
    });
    setImagePreview('');
    setEditImage(null);
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const updateFood = async (foodId) => {
    try {
      const formData = new FormData();
      formData.append('id', foodId);
      formData.append('name', editForm.name);
      formData.append('description', editForm.description);
      formData.append('price', editForm.price);
      formData.append('category', editForm.category);
      
      if (editImage) {
        formData.append('image', editImage);
      }

      const response = await axios.put(`${url}/api/food/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if(response.data.success){
        toast.success(response.data.message);
        await fetchList();
        cancelEdit();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Error updating food item');
    }
  }

  useEffect(()=>{
    fetchList();
  },[])

  return (
    <div className='list add flex-col'>
      <div className="list-header">
        <h2>All Foods List</h2>
        <p>Manage your food items with full CRUD operations</p>
      </div>
      
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Description</b>
          <b>Category</b>
          <b>Price</b>
          <b>Actions</b>
        </div>
        {list.map((item,index)=>{
          return(
            <div key={index} className='list-table-format'>
              {editingId === item._id ? (
                <>
                  <div className="image-upload">
                    <img src={imagePreview} alt='Preview'/>
                    <label className="upload-btn">
                      <FaUpload className="upload-icon" />
                      <input 
                        type="file" 
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{display: 'none'}}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="edit-input"
                    placeholder="Food Name"
                  />
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="edit-textarea"
                    placeholder="Description"
                    rows="2"
                  />
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="edit-select"
                  >
                    <option value="">Select Category</option>
                    <option value="Vegetarian">Salad</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Cake">Cake</option>
                    <option value="Pure Veg">Pure Veg</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Noodles">Noodles</option>
                  </select>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    className="edit-input"
                    placeholder="Price"
                    step="0.01"
                    min="0"
                  />
                  <div className="action-buttons">
                    <button 
                      onClick={() => updateFood(item._id)}
                      className="save-btn"
                      disabled={!editForm.name || !editForm.price || !editForm.category}
                    >
                      <FaSave className="action-icon" />
                    </button>
                    <button onClick={cancelEdit} className="cancel-btn">
                      <FaTimes className="action-icon" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <img src={`${url}/images/` +item.image} alt={item.name}/>
                  <p>{item.name}</p>
                  <p className="description">{item.description}</p>
                  <p className="category">{item.category}</p>
                  <p className="price">${item.price}</p>
                  <div className="action-buttons">
                    <button onClick={() => startEdit(item)} className="edit-btn">
                      <FaEdit className="action-icon" />
                    </button>
                    <button onClick={() => removeFood(item._id)} className="delete-btn">
                      <FaTrash className="action-icon" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default List