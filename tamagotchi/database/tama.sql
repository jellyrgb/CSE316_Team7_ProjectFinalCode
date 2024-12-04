-- MySQL dump 10.13  Distrib 9.1.0, for macos14 (x86_64)
--
-- Host: localhost    Database: tama
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `tama`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `tama` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `tama`;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `image_source` varchar(255) DEFAULT '/images/user.png',
  `stat` int DEFAULT '0',
  `buy_price` int DEFAULT '0',
  `sell_price` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,1,'/images/apple.png',15,10,5),(2,1,'/images/hotpot.png',45,30,14),(3,1,'/images/peach.png',15,10,7),(4,1,'/images/sushi.png',30,25,14),(5,2,'/images/toys1.png',10,5,3),(6,2,'/images/toys2.png',20,10,7),(7,2,'/images/toys3.png',30,15,11),(8,2,'/images/toys4.png',50,25,20),(9,3,'/images/soap.png',30,20,7),(10,3,'/images/soap2.png',50,30,18),(11,4,'/images/syringe.png',50,15,12),(12,4,'/images/syringe2.png',25,8,5);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobList`
--

DROP TABLE IF EXISTS `jobList`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobList` (
  `id` int NOT NULL AUTO_INCREMENT,
  `job_name` varchar(100) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `reward` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobList`
--

LOCK TABLES `jobList` WRITE;
/*!40000 ALTER TABLE `jobList` DISABLE KEYS */;
INSERT INTO `jobList` VALUES (1,'Delivery',10,50),(2,'Library',100,500),(3,'Box Folding',30,150);
/*!40000 ALTER TABLE `jobList` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `job_name` varchar(100) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `reward` int DEFAULT NULL,
  `start_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `level`
--

DROP TABLE IF EXISTS `level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tamagotchi_id` int NOT NULL,
  `level` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `tamagotchi_id` (`tamagotchi_id`),
  CONSTRAINT `level_ibfk_1` FOREIGN KEY (`tamagotchi_id`) REFERENCES `tamagotchi` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level`
--

LOCK TABLES `level` WRITE;
/*!40000 ALTER TABLE `level` DISABLE KEYS */;
INSERT INTO `level` VALUES (1,6,95),(2,7,90),(3,8,45),(4,9,10);
/*!40000 ALTER TABLE `level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tamagotchi`
--

DROP TABLE IF EXISTS `tamagotchi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tamagotchi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_source` varchar(255) DEFAULT NULL,
  `hunger` int DEFAULT '80',
  `clean` int DEFAULT '80',
  `fun` int DEFAULT '80',
  `is_sick` tinyint(1) DEFAULT '0',
  `adoption_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '0',
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tamagotchi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tamagotchi`
--

LOCK TABLES `tamagotchi` WRITE;
/*!40000 ALTER TABLE `tamagotchi` DISABLE KEYS */;
INSERT INTO `tamagotchi` VALUES (1,'Fluffy','/images/dog1.webp',80,90,70,0,'2024-01-01 00:00:00',0,1),(2,'Max','/images/dog2.avif',80,90,70,0,'2024-07-15 00:00:00',0,1),(3,'Buddy','/images/dog3.webp',80,90,70,0,'2024-12-02 00:00:00',1,1),(4,'first pet','/images/dog1.webp',50,50,50,1,'2024-12-03 00:00:00',1,2),(5,'fluffy','/images/dog1.webp',20,30,100,0,'2024-12-03 00:00:00',1,3),(6,'Fluffy','/images/dog1.webp',65,80,80,1,'2024-12-04 00:00:00',0,4),(7,'mk2','/images/dog1.webp',15,60,10,1,'2024-12-04 00:00:00',0,4),(8,'mk3','/images/dog1.webp',20,30,10,0,'2024-12-04 00:00:00',1,4),(9,'tama mk.1','/images/dog1.webp',20,30,10,0,'2024-12-04 00:00:00',1,5);
/*!40000 ALTER TABLE `tamagotchi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tamagotchi_templates`
--

DROP TABLE IF EXISTS `tamagotchi_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tamagotchi_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_source` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tamagotchi_templates`
--

LOCK TABLES `tamagotchi_templates` WRITE;
/*!40000 ALTER TABLE `tamagotchi_templates` DISABLE KEYS */;
INSERT INTO `tamagotchi_templates` VALUES (1,'/images/dog1.webp','Tamagotchi 1'),(2,'/images/dog1.webp','Tamagotchi 2'),(3,'/images/dog1.webp','Tamagotchi 3');
/*!40000 ALTER TABLE `tamagotchi_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(500) NOT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `balance` int DEFAULT '0',
  `creation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'John Doe','password123','/images/user.png',300,'2024-12-02 20:51:30'),(2,'nah','df8086362f6541f72136ff4ea3a69e85646d0137c4af9b64e7d554f218ad85','http://res.cloudinary.com/dkeneeift/image/upload/v1730882083/user_gyjnlf.png',327,'2024-12-03 02:30:08'),(3,'babo','6960acc359d73fea1a7fcee83900293364aa0165a0515ba9474d75dbb4225070',NULL,40,'2024-12-04 03:32:14'),(4,'Test','d9b5f58fb38198293971865a14074f59eba3e82595becbeeae51f1d9f1f65e',NULL,119,'2024-12-04 05:22:34'),(5,'taebo','4489ff224e4af77828b14ab2ecae34317ebc2f084be0cf0e4813380232d33277',NULL,50,'2024-12-04 10:11:23');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_inventory`
--

DROP TABLE IF EXISTS `user_inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_inventory` (
  `user_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`user_id`,`item_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `user_inventory_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_inventory_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_inventory`
--

LOCK TABLES `user_inventory` WRITE;
/*!40000 ALTER TABLE `user_inventory` DISABLE KEYS */;
INSERT INTO `user_inventory` VALUES (1,1,3),(2,4,1),(3,5,10),(4,4,1),(4,12,6),(5,4,1);
/*!40000 ALTER TABLE `user_inventory` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-04 20:40:34
