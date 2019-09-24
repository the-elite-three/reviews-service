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

CREATE TABLE review (
    id serial PRIMARY KEY,
    product_id integer,
    rating integer,
    rating_date date DEFAULT CURRENT_DATE,
    summary varchar(250),
    body varchar(1000),
    recommend boolean,
    reported boolean,
    reviewer_name varchar(60),
    reviewer_email varchar(60),
    response varchar(1000),
    helpfulness int DEFAULT 0
);

CREATE TABLE characteristics_review (
    id serial PRIMARY KEY,
    characteristic_id integer REFERENCES characteristics,
    review_id integer REFERENCES review,
    review_value integer
);

CREATE TABLE reviews_photos (
  id serial PRIMARY KEY,
  review_id integer REFERENCES review,
  photo_url varchar(2000)
);

\copy characteristics(id, product_id, char_name) FROM '~/code/reviews-service/characteristics.csv' DELIMITER ',' CSV HEADER;
\copy review(id, product_id, rating, rating_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '~/code/reviews-service/reviews.csv' DELIMITER ',' CSV HEADER;
\copy characteristics_review(id, characteristic_id, review_id, review_value) FROM '~/code/reviews-service/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
\copy reviews_photos(id, review_id, photo_url) FROM '~/code/reviews-service/reviews_photos.csv' DELIMITER ',' CSV HEADER;

-- Set sequence for unique ids
SELECT setval(pg_get_serial_sequence('review', 'id'), max(id)) FROM review;
SELECT setval(pg_get_serial_sequence('reviews_photos', 'id'), max(id)) FROM reviews_photos;
SELECT setval(pg_get_serial_sequence('characteristics_review', 'id'), max(id)) FROM characteristics_review;
SELECT setval(pg_get_serial_sequence('characteristics', 'id'), max(id)) FROM characteristics;

CREATE INDEX ON review (rating);
CREATE INDEX ON review (product_id);
CREATE INDEX ON reviews_photos (review_id);
CREATE INDEX ON characteristics_review (review_id);
CREATE INDEX ON characteristics_review (characteristic_id);