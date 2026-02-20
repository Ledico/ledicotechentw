/*
  # Seed Accessories Data

  Inserts 15 standard IT accessories into the accessories table
  for use in the Zubehör-Generator tab of the SUISA Portal.

  Categories include: Kabel, Adapter, Eingabegeräte, Zubehör, Hub,
  Kamera, Audio, Speicher, Docking, Monitor, Drucker, Netzwerk, Energie
*/

INSERT INTO accessories (name, category, description, compatibility, price, supplier, part_number)
VALUES
  ('USB-C Kabel 1m', 'Kabel', 'USB-C auf USB-C Ladekabel, 1 Meter', ARRAY['MacBook', 'iPad', 'Surface', 'ThinkPad'], 12.90, 'Digitec', 'KC-USB-C-1M'),
  ('USB-C auf HDMI Adapter', 'Adapter', 'USB-C auf HDMI 4K Adapter', ARRAY['MacBook', 'Surface', 'ThinkPad', 'Dell'], 24.90, 'Digitec', 'AD-USBC-HDMI'),
  ('USB-C auf Ethernet Adapter', 'Adapter', 'USB-C auf RJ45 Gigabit Ethernet', ARRAY['MacBook', 'Surface', 'ThinkPad'], 19.90, 'Digitec', 'AD-USBC-ETH'),
  ('Logitech MX Master 3S', 'Eingabegeräte', 'Kabellose ergonomische Maus', ARRAY['Windows', 'macOS', 'Linux'], 89.90, 'Digitec', 'LOG-MXM3S'),
  ('Logitech MX Keys S', 'Eingabegeräte', 'Kabellose Tastatur mit Beleuchtung', ARRAY['Windows', 'macOS', 'Linux'], 99.90, 'Digitec', 'LOG-MXKS'),
  ('Laptop-Ständer Aluminium', 'Zubehör', 'Verstellbarer Laptop-Ständer aus Aluminium', ARRAY['MacBook', 'ThinkPad', 'Dell', 'Surface'], 34.90, 'Digitec', 'ZB-LPSTAND'),
  ('USB-C Hub 7-in-1', 'Hub', '7-Port USB-C Hub mit HDMI, USB-A, SD, Ethernet', ARRAY['MacBook', 'Surface', 'ThinkPad'], 49.90, 'Digitec', 'HUB-7IN1'),
  ('Webcam Logitech C920', 'Kamera', 'Full HD Webcam 1080p', ARRAY['Windows', 'macOS', 'Linux'], 69.90, 'Digitec', 'LOG-C920'),
  ('Headset Jabra Evolve2 55', 'Audio', 'Kabelloses Business-Headset mit ANC', ARRAY['Windows', 'macOS'], 179.90, 'Digitec', 'JAB-E255'),
  ('USB-Stick 128GB', 'Speicher', 'USB 3.2 Flash Drive 128GB', ARRAY['Windows', 'macOS', 'Linux'], 19.90, 'Digitec', 'SP-USB128'),
  ('Docking Station USB-C', 'Docking', 'Triple Display USB-C Docking Station', ARRAY['ThinkPad', 'Dell', 'HP'], 199.90, 'Digitec', 'DOCK-USBC-3'),
  ('Monitor-Kabel DisplayPort', 'Kabel', 'DisplayPort 1.4 Kabel 2m', ARRAY['Desktop', 'Docking Station'], 14.90, 'Digitec', 'KC-DP-2M'),
  ('Netzwerkkabel Cat6 3m', 'Netzwerk', 'Ethernet Kabel Cat6 RJ45 3 Meter', ARRAY['Desktop', 'Docking Station', 'Switch'], 8.90, 'Digitec', 'KC-CAT6-3M'),
  ('Druckerpatrone HP 305XL', 'Drucker', 'HP 305XL Schwarz Tintenpatrone', ARRAY['HP DeskJet', 'HP ENVY'], 29.90, 'Digitec', 'HP-305XL-BK'),
  ('USV APC 700VA', 'Energie', 'Unterbrechungsfreie Stromversorgung 700VA', ARRAY['Desktop', 'Server', 'NAS'], 89.90, 'Digitec', 'APC-BX700')
ON CONFLICT DO NOTHING;