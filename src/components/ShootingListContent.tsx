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
    max-width: 1200px;
    margin: 0 auto;
    min-height: 80vh;
    padding-top: 30px;
`;

const SidebarWrapper = styled.div`
    flex: 0 0 auto;
`;

const MainContent = styled.div`
    flex: 1 1 0%;
    padding: 0 20px 20px 20px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
`;

const CardGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
`;

const CardWrapper = styled.div`
    flex: 0 0 300px;
    max-width: 400px;
    min-width: 300px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;

  button {
    padding: 6px 12px;
    border: 1px solid #888;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    color: black;

    &:disabled {
      background: #eee;
      cursor: default;
    }
  }
`;

const GraphWrapper = styled.div`
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;
  padding: 100px;
  padding-left: 0;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #888;
  border-radius: 4px;
  background: white;
  cursor: pointer;

  &:disabled {
    background: #eee;
    cursor: default;
  }

  &:hover:not(:disabled) {
    background: #f0f0f0;
  }
`;

const PageInfo = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

export default function ShootingListContent() {
    const [shootings, setShootings] = useState<Shooting[]>([]);
    const [viewMode, setViewMode] = useState<'card' | 'table' | 'graph'>('card');
    const [selectedFilters, setSelectedFilters] = useState({
        year: "",
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
            const res = await fetch(`https://services.arcgis.com/sFnw0xNflSi8J0uh/arcgis/rest/services/Person_Shot_Tbl_view/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`);
            const data = await res.json();

            const sortedData = [...data.features].sort((a, b) =>
                b.attributes.Shooting_Date - a.attributes.Shooting_Date
            );

            setShootings(sortedData);
        }

        getShootings();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilters, viewMode]);

    const handleFilterChange = (key: string, value: string | boolean) => {
        setSelectedFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setSelectedFilters({
            year: "",
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
            if (selectedFilters.year && attrs.YEAR.toString() !== selectedFilters.year) return false;
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
                    <button onClick={() => setViewMode('card')} disabled={viewMode === 'card'}>
                        Card View
                    </button>
                    <button onClick={() => setViewMode('table')} disabled={viewMode === 'table'}>
                        Table View
                    </button>
                    <button onClick={() => setViewMode('graph')} disabled={viewMode === 'graph'}>
                        Graph View
                    </button>
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
                            &laquo; First
                        </PageButton>
                        <PageButton onClick={handlePrevPage} disabled={currentPage === 1}>
                            &lsaquo; Previous
                        </PageButton>
                        <span>Page {currentPage} of {totalPages}</span>
                        <PageButton onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Next &rsaquo;
                        </PageButton>
                        <PageButton onClick={handleLastPage} disabled={currentPage === totalPages}>
                            Last &raquo;
                        </PageButton>
                    </PaginationWrapper>
                )}
            </MainContent>
        </Layout>
    );
}