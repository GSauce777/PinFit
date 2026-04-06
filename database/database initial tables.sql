USE pinfit;

#user table
create table users (
	id int primary key auto_increment,
    username varchar(50) unique not null,
    email varchar(100) unique not null,
    password varchar(255) not null,
    created_at timestamp default current_timestamp
);

#table for saved outfits
create table saved_outfits (
	id int primary key auto_increment,
    user_id int not null,
    outfit_name varchar(50) not null,
    top_image_url text,
    bottom_image_url text,
    shoes_image_url text,
    created_at timestamp default current_timestamp,
    foreign key (user_id) references users(id) on delete cascade
);

#for testing purposes
insert into users (username, email, password) values ('zavi','zavi@example.com','nothing') on duplicate key update username=username;

SHOW TABLES;

Select * from users;

