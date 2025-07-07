-- Clear existing tutorials data
DELETE FROM tutorials;

-- Insert sample tutorial data for testing
INSERT INTO tutorials (id, type, title, image, link, sort_order) VALUES
('wapp-1', 'wapp', 'Como configurar sua TV', '/placeholder.svg', 'https://example.com/tutorial1', 1),
('wapp-2', 'wapp', 'Instalação do aplicativo', '/placeholder.svg', 'https://example.com/tutorial2', 2),
('wapp-3', 'wapp', 'Configurações avançadas', '/placeholder.svg', 'https://example.com/tutorial3', 3),
('kr-1', 'krator', 'Setup inicial Krator', '/placeholder.svg', 'https://example.com/krator1', 1),
('kr-2', 'krator', 'Configuração Krator Pro', '/placeholder.svg', 'https://example.com/krator2', 2);