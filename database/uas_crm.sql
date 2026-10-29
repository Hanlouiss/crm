-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2025 at 03:02 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uas_crm`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer_points`
--

CREATE TABLE `customer_points` (
  `customer_id` int(11) NOT NULL,
  `total_points` int(11) DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_points`
--

INSERT INTO `customer_points` (`customer_id`, `total_points`, `last_updated`) VALUES
(10, 5010, '2025-01-05 12:38:56'),
(11, 1140, '2024-10-25 05:52:58'),
(20, 700, '2024-11-06 06:45:36'),
(30, 250, '2025-01-07 07:53:45');

-- --------------------------------------------------------

--
-- Table structure for table `data_pelanggan`
--

CREATE TABLE `data_pelanggan` (
  `id_pelanggan` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `tempat_tinggal` varchar(255) NOT NULL,
  `no_telp` varchar(15) NOT NULL,
  `id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_pelanggan`
--

INSERT INTO `data_pelanggan` (`id_pelanggan`, `nama`, `tanggal_lahir`, `tempat_tinggal`, `no_telp`, `id`) VALUES
(1, 'Hanlouis', '2004-10-24', 'Jakarta', '087877220666', 11),
(2, 'Hanlouis2', '2004-10-24', 'Bandung', '123456789011', 10),
(5, 'Hanlouis', '2025-06-10', 'Jl A4 No 55B', '087877220666', 30);

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

CREATE TABLE `log` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `hak_akses` int(11) DEFAULT NULL,
  `membership` int(11) DEFAULT NULL,
  `level` enum('0','Bronze','Silver','Gold','Platinum') DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log`
--

INSERT INTO `log` (`id`, `name`, `email`, `password`, `hak_akses`, `membership`, `level`) VALUES
(1, 'Hanz', 'louiscpn1@gmail.com', '1', 1, 0, '0'),
(10, 'Hanlouis', 'louiscpn1@gmail.com', '12', 2, 1, 'Platinum'),
(11, 'Hans', 'hanlouis309@gmail.com', '1', 2, 1, 'Platinum'),
(20, 'Tes1', 'louiscpn1@gmail.com', '12345', 2, 1, 'Bronze'),
(30, 'Pelanggan1', 'hanslouis36@gmail.com', '1', 2, 1, 'Silver'),
(31, 'Hanlouis', 'admin@example.com', '1', 2, 1, '0');

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE `membership` (
  `id` int(11) DEFAULT NULL,
  `membership` int(11) DEFAULT NULL,
  `menu` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `role_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`id`, `membership`, `menu`, `path`, `role_name`) VALUES
(1, 1, 'Membership Shop', 'http://localhost/crm_tes2/membershipshop.php', 'Pelanggan'),
(3, 1, 'Beli Barang', 'http://localhost/crm_tes2/beliproduk.php	', 'Pelanggan'),
(4, 1, 'Check Transaksi', 'http://localhost/crm_tes2/lihattransaksi.php	', 'Pelanggan');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `product_name`, `price`) VALUES
(1, 'Produk 1', 12000.00),
(2, 'Produk 2', 12200.00);

-- --------------------------------------------------------

--
-- Table structure for table `reward_products`
--

CREATE TABLE `reward_products` (
  `id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `point_cost` int(11) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reward_products`
--

INSERT INTO `reward_products` (`id`, `product_name`, `point_cost`, `description`) VALUES
(1, 'Produk Membership 1', 10, 'Diskon A'),
(3, 'Produk Membership 2', 100, 'Diskon B');

-- --------------------------------------------------------

--
-- Table structure for table `transaksipoin`
--

CREATE TABLE `transaksipoin` (
  `id` int(11) NOT NULL,
  `id_customer` int(11) NOT NULL,
  `id_poin` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `total_poin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksipoin`
--

INSERT INTO `transaksipoin` (`id`, `id_customer`, `id_poin`, `qty`, `total_poin`) VALUES
(22, 10, 3, 10, 1000),
(23, 10, 1, 1, 10),
(24, 10, 1, 1, 10),
(25, 10, 3, 1, 100),
(26, 11, 3, 1, 100),
(27, 11, 3, 1, 100),
(28, 20, 1, 1, 10),
(29, 10, 1, 1, 10),
(30, 30, 1, 1, 10);

-- --------------------------------------------------------

--
-- Table structure for table `transaksiproduk`
--

CREATE TABLE `transaksiproduk` (
  `id` int(11) NOT NULL,
  `id_produk` int(11) DEFAULT NULL,
  `id_customer` int(11) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `total_harga` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksiproduk`
--

INSERT INTO `transaksiproduk` (`id`, `id_produk`, `id_customer`, `qty`, `total_harga`) VALUES
(35, 2, 10, 5000, 61000000.00),
(36, 2, 11, 100, 1220000.00),
(37, 2, 10, 1, 12200.00),
(38, 1, 10, 10, 120000.00),
(39, 1, 10, 1, 12000.00),
(40, 1, 10, 2, 24000.00),
(41, 1, 10, 1, 12000.00),
(42, 1, 10, 10, 120000.00),
(43, 2, 11, 1000, 12200000.00),
(44, 1, 10, 20, 240000.00),
(45, 1, 20, 10, 120000.00),
(47, 1, 20, 90, 1080000.00),
(48, 1, 30, 1, 12000.00),
(49, 1, 30, 20, 240000.00),
(50, 1, 30, 200, 2400000.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer_points`
--
ALTER TABLE `customer_points`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indexes for table `data_pelanggan`
--
ALTER TABLE `data_pelanggan`
  ADD PRIMARY KEY (`id_pelanggan`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reward_products`
--
ALTER TABLE `reward_products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaksipoin`
--
ALTER TABLE `transaksipoin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_customer` (`id_customer`),
  ADD KEY `id_poin` (`id_poin`);

--
-- Indexes for table `transaksiproduk`
--
ALTER TABLE `transaksiproduk`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_produk` (`id_produk`),
  ADD KEY `id_customer` (`id_customer`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data_pelanggan`
--
ALTER TABLE `data_pelanggan`
  MODIFY `id_pelanggan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `reward_products`
--
ALTER TABLE `reward_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transaksipoin`
--
ALTER TABLE `transaksipoin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `transaksiproduk`
--
ALTER TABLE `transaksiproduk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer_points`
--
ALTER TABLE `customer_points`
  ADD CONSTRAINT `customer_points_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `log` (`id`);

--
-- Constraints for table `data_pelanggan`
--
ALTER TABLE `data_pelanggan`
  ADD CONSTRAINT `data_pelanggan_ibfk_1` FOREIGN KEY (`id`) REFERENCES `log` (`id`);

--
-- Constraints for table `transaksipoin`
--
ALTER TABLE `transaksipoin`
  ADD CONSTRAINT `transaksipoin_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `log` (`id`),
  ADD CONSTRAINT `transaksipoin_ibfk_2` FOREIGN KEY (`id_poin`) REFERENCES `reward_products` (`id`);

--
-- Constraints for table `transaksiproduk`
--
ALTER TABLE `transaksiproduk`
  ADD CONSTRAINT `transaksiproduk_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `transaksiproduk_ibfk_2` FOREIGN KEY (`id_customer`) REFERENCES `log` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
