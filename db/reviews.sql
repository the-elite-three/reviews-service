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

CREATE INDEX ON review (rating);

\copy characteristics(id, product_id, char_name) FROM '~/code/reviews-service/db/characteristics.csv' DELIMITER ',' CSV HEADER;
\copy review(id, product_id, rating, rating_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '~/code/reviews-service/db/reviews.csv' DELIMITER ',' CSV HEADER;
\copy characteristics_review(id, characteristic_id, review_id, review_value) FROM '~/code/reviews-service/db/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
\copy reviews_photos(id, review_id, photo_url) FROM '~/code/reviews-service/db/reviews_photos.csv' DELIMITER ',' CSV HEADER;