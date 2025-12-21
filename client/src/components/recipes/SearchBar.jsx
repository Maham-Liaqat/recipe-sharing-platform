import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setFilters, fetchRecipes } from '../../store/slices/recipeSlice';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Typography,
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  TrendingUp,
  AccessTime,
  Star,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: 50,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flex: 1,
  fontSize: '1rem',
}));

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showFilters, setShowFilters] = useState(false);
  
  const sortOptions = [
    { value: '-createdAt', label: 'Newest', icon: <TrendingUp sx={{ fontSize: 16 }} /> },
    { value: 'createdAt', label: 'Oldest', icon: <TrendingUp sx={{ fontSize: 16, transform: 'rotate(180deg)' }} /> },
    { value: '-averageRating', label: 'Top Rated', icon: <Star sx={{ fontSize: 16 }} /> },
    { value: 'prepTime', label: 'Quickest', icon: <AccessTime sx={{ fontSize: 16 }} /> },
    { value: '-prepTime', label: 'Longest', icon: <AccessTime sx={{ fontSize: 16 }} /> },
    { value: '-views', label: 'Most Viewed' },
    { value: 'title', label: 'A to Z' },
    { value: '-title', label: 'Z to A' },
  ];

  // Get search term from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const sortParam = params.get('sort');
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Update URL
      const params = new URLSearchParams(location.search);
      params.set('search', searchTerm.trim());
      navigate(`${location.pathname}?${params.toString()}`);
      
      // Update Redux state
      dispatch(setFilters({ search: searchTerm.trim() }));
      dispatch(fetchRecipes({ search: searchTerm.trim(), sort: sortBy }));
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    const params = new URLSearchParams(location.search);
    params.delete('search');
    navigate(`${location.pathname}?${params.toString()}`);
    
    dispatch(setFilters({ search: '' }));
    dispatch(fetchRecipes({}));
  };

  const handleSortChange = (event) => {
    const newSort = event.target.value;
    setSortBy(newSort);
    
    const params = new URLSearchParams(location.search);
    params.set('sort', newSort);
    navigate(`${location.pathname}?${params.toString()}`);
    
    dispatch(setFilters({ sort: newSort }));
    dispatch(fetchRecipes({ ...Object.fromEntries(params), sort: newSort }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
        <SearchContainer component="form" onSubmit={handleSearch}>
          <IconButton type="submit" sx={{ p: '10px', color: 'primary.main' }}>
            <Search />
          </IconButton>
          
          <SearchInput
            placeholder="Search recipes, ingredients, cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            inputProps={{ 'aria-label': 'search recipes' }}
          />
          
          {searchTerm && (
            <IconButton onClick={handleClear} sx={{ p: '10px' }}>
              <Clear />
            </IconButton>
          )}
          
          <IconButton 
            onClick={() => setShowFilters(!showFilters)} 
            sx={{ 
              p: '10px',
              color: showFilters ? 'primary.main' : 'inherit'
            }}
          >
            <FilterList />
          </IconButton>
        </SearchContainer>
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sort by"
            sx={{ borderRadius: 3, backgroundColor: 'background.paper' }}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {option.icon}
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {/* Search suggestions */}
      {searchTerm && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip
            label={`"${searchTerm}" recipes`}
            size="small"
            onClick={handleSearch}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label={`${searchTerm} easy`}
            size="small"
            onClick={() => {
              setSearchTerm(`${searchTerm} easy`);
              handleSearch({ preventDefault: () => {} });
            }}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label={`${searchTerm} dinner`}
            size="small"
            onClick={() => {
              setSearchTerm(`${searchTerm} dinner`);
              handleSearch({ preventDefault: () => {} });
            }}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label={`${searchTerm} vegetarian`}
            size="small"
            onClick={() => {
              setSearchTerm(`${searchTerm} vegetarian`);
              handleSearch({ preventDefault: () => {} });
            }}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      )}
      
      {/* Recent searches (you can store these in localStorage) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">
          Try searching for:
        </Typography>
        {['pasta', 'chicken', 'dessert', 'healthy', 'quick'].map((term) => (
          <Chip
            key={term}
            label={term}
            size="small"
            variant="outlined"
            onClick={() => {
              setSearchTerm(term);
              handleSearch({ preventDefault: () => {} });
            }}
            sx={{ cursor: 'pointer' }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SearchBar;