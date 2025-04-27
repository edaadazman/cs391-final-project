import { useState, useEffect } from "react";
import styled from 'styled-components';
import { Shooting } from "../../types";
import ShootingPreview from "./ShootingPreview";

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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

export default function ShootingListContent() {
    const [shootings, setShootings] = useState<Shooting[]>([]);


    useEffect(() => {
        async function getShootings() {
            const res = await fetch(`https://services.arcgis.com/sFnw0xNflSi8J0uh/arcgis/rest/services/Person_Shot_Tbl_view/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json`);
            const data = await res.json();
            setShootings(data.features);
        }

        getShootings();
    }, []);

    return (
        <Container>
            <Title>Boston Shooting Incidents</Title>
            <CardGrid>
                {shootings.map((shooting) => (
                    <CardWrapper key={shooting.attributes.OBJECTID}>
                        <ShootingPreview
                            shooting={shooting}
                        />
                    </CardWrapper>
                ))}
            </CardGrid>
        </Container>
    );
}