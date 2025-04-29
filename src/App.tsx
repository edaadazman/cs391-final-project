import styled from 'styled-components';
import ShootingListContent from './components/ShootingListContent';

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: #121212;
  padding: 20px;
  color: #e0e0e0;
  box-sizing: border-box;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #e0e0e0;
  font-size: 2.5rem;
`;

function App() {
  return (
    <AppContainer>
      <Header>
        <Title>Boston Shooting Data</Title>
      </Header>
      <ShootingListContent />
    </AppContainer>
  );
}

export default App;
