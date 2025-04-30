// Styling and structure implemented by Edaad Azman
import styled from 'styled-components';
import ShootingListContent from './components/ShootingListContent';

const AppContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: rgb(18, 18, 18);
  padding: 20px;
  color: rgb(224, 224, 224);
  box-sizing: border-box;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: rgb(224, 224, 224);
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
