USE employee_db;

INSERT INTO department (name)
VALUES ("Operations"),
("Analytics"),
("Marketing"),
("Executive");

INSERT INTO role (id, title, salary, department_id)
VALUES 
(1,"General Manager", 100000, 1),
(2, "Coach", 90000, 1), 
(3, "Team Lead Analyst", 95000, 2),
(4, "Media Manager", 85000, 3),
(5, "Team Analyst", 90000, 2),
(6, "CEO", 1000000, 4),
(7, "Executive Assistant", 500000, 4),
(8, "Media Specialist", 80000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Shaun", "Reed", 1, null), 
(2, "Mae", "Mitchell", 2, 1),
(3, "Abbie", "Smith", 3, null),
(4, "Blake", "Fisher", 3, 3),
(5, "Molly", "Price", 4, null), 
(6, "Jack", "Hudson", 5, 5),
(7, "Pinch", "Reyes", 6, null),
(8, "Loren", "Bailey", 7, 6),
(9, "Willy", "Roberts", 8, 5);