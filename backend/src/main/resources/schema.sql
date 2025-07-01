-- Drop tables if they already exist
DROP TABLE IF EXISTS survey_responses;
DROP TABLE IF EXISTS customers;

-- Recreate customers table
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  visit_date DATE NOT NULL,
  location VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

-- Recreate survey_responses table
CREATE TABLE survey_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  food_quality ENUM('Highly Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Highly Dissatisfied') NOT NULL,
  service_speed ENUM('Highly Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Highly Dissatisfied') NOT NULL,
  staff_friendliness ENUM('Highly Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Highly Dissatisfied') NOT NULL,
  cleanliness ENUM('Highly Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Highly Dissatisfied') NOT NULL,
  value_for_money ENUM('Highly Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Highly Dissatisfied') NOT NULL,
  ambiance ENUM('Highly Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Highly Dissatisfied') NOT NULL,
  overall_rating INT NOT NULL,
  comments TEXT,
  created_at TIMESTAMP NOT NULL,

  CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
