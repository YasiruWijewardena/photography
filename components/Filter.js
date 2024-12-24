// components/Filter.js

import { useEffect, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Box } from '@mui/material';
import axios from 'axios';
import { usePhotos } from '../context/PhotoContext'; // Assuming you have a PhotoContext

export default function Filter() {
  const [categories, setCategories] = useState([]);
  const { filters, setFilters } = usePhotos();

  useEffect(() => {
    // Fetch available categories from the API
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setFilters(prev => ({
        ...prev,
        categories: [...prev.categories, name],
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.filter(cat => cat !== name),
      }));
    }
  };

  return (
    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <FormControl component="fieldset">
        <FormLabel component="legend">Filter by Categories</FormLabel>
        <FormGroup row>
          {categories.map(category => (
            <FormControlLabel
              key={category.id}
              control={
                <Checkbox
                  checked={filters.categories.includes(category.name)}
                  onChange={handleChange}
                  name={category.name}
                />
              }
              label={category.name}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}
