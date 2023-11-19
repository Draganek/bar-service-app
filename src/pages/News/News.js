import React, { useState } from 'react';

const News = () => {
  const [selectedOption, setSelectedOption] = useState('Choose an option');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div class="dropdown">
	  <h1>Tu możliwe że będą newsy</h1>
	</div>
  );
};

export default News;
