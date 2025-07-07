-- Clear existing tutorials data
DELETE FROM tutorials;

-- Insert sample tutorial data for testing using proper UUIDs
INSERT INTO tutorials (type, title, image, link, sort_order) VALUES
('wapp', 'Como configurar sua TV', '/placeholder.svg', 'https://example.com/tutorial1', 1),
('wapp', 'Instalação do aplicativo', '/placeholder.svg', 'https://example.com/tutorial2', 2),
('wapp', 'Configurações avançadas', '/placeholder.svg', 'https://example.com/tutorial3', 3),
('krator', 'Setup inicial Krator', '/placeholder.svg', 'https://example.com/krator1', 1),
('krator', 'Configuração Krator Pro', '/placeholder.svg', 'https://example.com/krator2', 2);