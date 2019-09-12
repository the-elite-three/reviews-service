DROP DATABASE IF EXISTS reviews;
DROP SCHEMA IF EXISTS rv CASCADE;

CREATE DATABASE reviews;
CREATE SCHEMA rv;

\c reviews

CREATE TABLE characteristics (
    id serial PRIMARY KEY,
    product_id integer,
    char_name varchar(50)
);

CREATE TABLE characteristics_review (
    id serial PRIMARY KEY,
    characteristic_id integer,
    review_id integer,
    review_value integer
);

CREATE TABLE review (
    id serial PRIMARY KEY,
    product_id integer,
    rating integer,
    rating_date date,
    summary varchar(250),
    body varchar(1000),
    recommend boolean,
    reported boolean,
    reviewer_name varchar(60),
    reviewer_email varchar(60),
    response varchar(1000),
    helpfulness int
);

CREATE TABLE reviews_photos (
  id serial PRIMARY KEY,
  review_id integer,
  photo_url varchar(2000)
);

-- \copy characteristics(id, product_id, char_name) FROM '~/code/reviews-service/db/characteristics.csv' DELIMITER ',' CSV HEADER;
-- \copy characteristics_review(id, characteristic_id, review_id, review_value) FROM '~/code/reviews-service/db/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
\copy review(id, product_id, rating, rating_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '~/code/reviews-service/db/reviews.csv' DELIMITER ',' CSV HEADER;