import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/(backoffice)/backoffice/page';

describe('Login Page', () => {
    it('renders login form', () => {
        // We might need to mock metadata or use standard render if it's a server component
        // But since it's a test for Block 8, I'll follow the user's snippet.
        render(<LoginPage />);
        expect(screen.getByPlaceholderText(/nome@imi.com.br/i)).toBeInTheDocument();
    });
});
