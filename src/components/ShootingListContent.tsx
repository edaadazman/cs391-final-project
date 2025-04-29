import { useState, useEffect } from "react";
import styled from 'styled-components';
import { Shooting } from "../../types";
import ShootingPreview from "./ShootingPreview";
import FilterBar from "./FilterBar";
import ShootingTable from "./ShootingTable";
import ShootingGraph from "./ShootingGraph";

const Layout = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  min-height: 80vh;
  padding-top: 30px;
  gap: 30px;
`;

const SidebarWrapper = styled.div`
  flex: 0 0 auto;
  position: sticky;
  top: 30px;
  align-self: flex-start;
`;

const MainContent = styled.div`
  flex: 1 1 0%;
  padding: 25px;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
  color: #bb86fc;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.2rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 15px;
`;

const CardGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  justify-content: center;
`;

const CardWrapper = styled.div`
  flex: 0 0 300px;
  max-width: 400px;
  min-width: 300px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
`;

const ViewToggleButton = styled.button<{ isActive: boolean }>`
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background-color: ${props => props.isActive ? '#bb86fc' : 'rgba(255, 255, 255, 0.08)'};
  color: ${props => props.isActive ? '#121212' : '#e0e0e0'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  box-shadow: ${props => props.isActive ? '0 2px 4px rgba(0, 0, 0, 0.4)' : 'none'};

  &:hover {
    background-color: ${props => props.isActive ? '#bb86fc' : 'rgba(255, 255, 255, 0.15)'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const GraphWrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 40px 0;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
  align-items: center;
  padding: 15px 0;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
`;

const PageButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  background-color: ${props => props.variant === 'primary' ? '#bb86fc' : 'rgba(255, 255, 255, 0.08)'};
  color: ${props => props.variant === 'primary' ? '#121212' : '#e0e0e0'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
  }

  &:hover{
    background-color: ${props => props.variant === 'primary' ? '#bb86fc' : 'rgba(255, 255, 255, 0.15)'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  }
`;

const PageInfo = styled.div`
  font-size: 0.9rem;
  color: #a0a0a0;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 8px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
`;

export default function ShootingListContent() {
    const [shootings, setShootings] = useState<Shooting[]>([]);
    const [viewMode, setViewMode] = useState<'card' | 'table' | 'graph'>('card');
    const [selectedFilters, setSelectedFilters] = useState({
        year: [] as string[],
        district: "",
        neighborhood: "",
        shootingType: "",
        victimGender: "",
        victimRace: "",
        multiVictim: false
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        async function getShootings() {
            try {
                const res = await fetch(`https://services.arcgis.com/sFnw0xNflSi8J0uh/arcgis/rest/services/Person_Shot_Tbl_view/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`);
                const data = await res.json();

                const sortedData = [...data.features].sort((a, b) =>
                    b.attributes.Shooting_Date - a.attributes.Shooting_Date
                );

                setShootings(sortedData);
            } catch (err) {
                console.log(err)
            }
        }

        getShootings();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilters, viewMode]);

    const handleFilterChange = (key: string, value: string[] | string | boolean) => {
        setSelectedFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setSelectedFilters({
            year: [],
            district: "",
            neighborhood: "",
            shootingType: "",
            victimGender: "",
            victimRace: "",
            multiVictim: false
        });
    };

    const filterShootings = (shootings: Shooting[]) => {
        return shootings.filter(shooting => {
            const attrs = shooting.attributes;
            if (selectedFilters.year.length > 0 && !selectedFilters.year.includes(attrs.YEAR.toString())) return false;
            if (selectedFilters.district && attrs.District !== selectedFilters.district) return false;
            if (selectedFilters.neighborhood && attrs.NEIGHBORHOOD !== selectedFilters.neighborhood) return false;
            if (selectedFilters.shootingType && attrs.Shooting_Type_V2 !== selectedFilters.shootingType) return false;
            if (selectedFilters.victimGender && attrs.Victim_Gender !== selectedFilters.victimGender) return false;
            if (selectedFilters.victimRace && attrs.Victim_Race !== selectedFilters.victimRace) return false;
            if (selectedFilters.multiVictim && attrs.Multi_Victim !== 1) return false;
            return true;
        });
    };

    const visible = filterShootings(shootings);

    const totalPages = Math.ceil(visible.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, visible.length);
    const currentItems = visible.slice(startIndex, endIndex);

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <Layout>
            <SidebarWrapper>
                <FilterBar
                    shootings={shootings}
                    onChange={handleFilterChange}
                    onClear={handleClearFilters}
                />
            </SidebarWrapper>
            <MainContent>
                <Title>Boston Shooting Incidents</Title>

                <ToggleWrapper>
                    <ViewToggleButton
                        onClick={() => setViewMode('card')}
                        isActive={viewMode === 'card'}
                    >
                        Card View
                    </ViewToggleButton>
                    <ViewToggleButton
                        onClick={() => setViewMode('table')}
                        isActive={viewMode === 'table'}
                    >
                        Table View
                    </ViewToggleButton>
                    <ViewToggleButton
                        onClick={() => setViewMode('graph')}
                        isActive={viewMode === 'graph'}
                    >
                        Graph View
                    </ViewToggleButton>
                </ToggleWrapper>

                {viewMode !== 'graph' && visible.length > 0 && (
                    <PageInfo>
                        Showing {startIndex + 1}-{endIndex} of {visible.length} results
                    </PageInfo>
                )}

                {viewMode === 'card' ? (
                    <CardGrid>
                        {currentItems.map(s => (
                            <CardWrapper key={s.attributes.OBJECTID}>
                                <ShootingPreview shooting={s} />
                            </CardWrapper>
                        ))}
                    </CardGrid>
                ) : viewMode === 'table' ? (
                    <ShootingTable shootings={currentItems} />
                ) : (
                    <GraphWrapper>
                        <ShootingGraph shootings={visible} />
                    </GraphWrapper>
                )}

                {viewMode !== 'graph' && totalPages > 1 && (
                    <PaginationWrapper>
                        <PageButton onClick={handleFirstPage} disabled={currentPage === 1}>
                            &lt;&lt; First
                        </PageButton>
                        <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                            &lt; Previous
                        </PageButton>
                        <span>Page {currentPage} of {totalPages}</span>
                        <PageButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next &gt;
                        </PageButton>
                        <PageButton onClick={handleLastPage} disabled={currentPage === totalPages}>
                            Last &gt;&gt;
                        </PageButton>
                    </PaginationWrapper>
                )}
            </MainContent>
        </Layout>
    );
}