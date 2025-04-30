// This component was implemented by Edaad Azman (except for filtering logic)
// Filtering logic was impelemented by Saksham Goel
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
    background-color: rgb(30, 30, 30);
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
`;

const Title = styled.h2`
    color: rgb(187, 134, 252);
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
    background-color: ${props => props.isActive ? 'rgb(187, 134, 252)' : 'rgba(255, 255, 255, 0.08)'};
    color: ${props => props.isActive ? 'rgb(18, 18, 18)' : 'rgb(224, 224, 224)'};
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: ${props => props.isActive ? '0 2px 4px rgba(0, 0, 0, 0.4)' : 'none'};

    &:hover {
    background-color: ${props => props.isActive ? 'rgb(187, 134, 252)' : 'rgba(255, 255, 255, 0.15)'};
    }

    &:disabled {
    opacity: 0.7;
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
    background-color: ${props => props.variant === 'primary' ? 'rgb(187, 134, 252)' : 'rgba(255, 255, 255, 0.08)'};
    color: ${props => props.variant === 'primary' ? 'rgb(18, 18, 18)' : 'rgb(224, 224, 224)'};
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:disabled {
    opacity: 0.5;
    }

    &:hover{
    background-color: ${props => props.variant === 'primary' ? 'rgb(187, 134, 252)' : 'rgba(255, 255, 255, 0.15)'};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
    }
`;

const PageInfo = styled.div`
    font-size: 0.9rem;
    color: rgb(160, 160, 160);
    background-color: rgba(255, 255, 255, 0.05);
    padding: 8px 15px;
    border-radius: 4px;
    margin-bottom: 20px;
    text-align: center;
`;

export default function ShootingListContent() {
    const [shootings, setShootings] = useState<Shooting[]>([]); // stores API data
    const [viewMode, setViewMode] = useState<'card' | 'table' | 'graph'>('card'); // useState hook to track view mode
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

    // useEffect hook that calls the API to fetch shooting data
    useEffect(() => {
        async function getShootings() {
            try {
                const res = await fetch(`https://services.arcgis.com/sFnw0xNflSi8J0uh/arcgis/rest/services/Person_Shot_Tbl_view/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`);
                const data = await res.json();

                // The data is originally sorted in ascending order but this sorts it in descending order by date
                // to show the most recent shootings first
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

    // useEffect hook used to reset pagination when filters change
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
    // Filtering logic: filters shootings based on selected attributes
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
    // Filtering shootings are then stored in visible
    const visible = filterShootings(shootings);

    // Pagination logic
    const totalPages = Math.ceil(visible.length / itemsPerPage); // total number of pages
    const startIndex = (currentPage - 1) * itemsPerPage; // start idx for current page
    const endIndex = Math.min(startIndex + itemsPerPage, visible.length); // end idx for current page
    const currentItems = visible.slice(startIndex, endIndex); // array of items for current page

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages)); // ensure we don't go over total pages
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1)); // ensure we don't go below 1
    };

    const handleFirstPage = () => {
        setCurrentPage(1); // reset to first page
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages); // go to last page
    };

    return (
        <Layout>
            <SidebarWrapper>
                <FilterBar
                    // pass in shootings, handleFilterChange, and handleClearFilters
                    shootings={shootings} 
                    onChange={handleFilterChange}
                    onClear={handleClearFilters}
                />
            </SidebarWrapper>
            <MainContent>
                <Title>Boston Shooting Incidents</Title>

                {/* navigation options - conditional rendering based on view mode */}
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

                {/* the number of results showing in the page except for graph because graph doesn't have multiple pages */}
                {viewMode !== 'graph' && visible.length > 0 && (
                    <PageInfo>
                        Showing {startIndex + 1}-{endIndex} of {visible.length} results
                    </PageInfo>
                )}

                {/* conditional rendering based on view mode */}
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

                {/* controls for pagination again except for graph because graph view is just a single page */}
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