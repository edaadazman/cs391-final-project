import styled from 'styled-components';
import { Shooting } from '../../types';

const PreviewCard = styled.div<{ isFatal: boolean }>`
    border: none;
    border-radius: 12px;
    padding: 20px;
    background-color: ${props => props.isFatal
        ? 'rgba(207, 102, 121, 0.15)'
        : 'rgba(3, 218, 198, 0.08)'};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    color: #e0e0e0;
    height: 320px;
    display: flex;
    flex-direction: column;
    
    &:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
    }
`;

const IncidentTitle = styled.h3`
    color: #e0e0e0;
    margin-top: 0;
    padding-bottom: 12px;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const InfoSection = styled.div`
    display: grid;
    gap: 10px;
    margin-top: 16px;
    flex: 1; 
`;

const InfoItem = styled.div`
    margin: 0;
    strong {
        color: #bb86fc;
        font-weight: 500;
        margin-right: 5px;
    }
`;

const CardFooter = styled.div`
    margin-top: auto; 
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 40px; 
`;

const MultiVictimTag = styled.div`
    background-color: #cf6679;
    color: #121212;
    padding: 4px 10px;
    border-radius: 4px;
    display: inline-block;
    font-weight: 600;
    font-size: 0.8rem;
`;

const TypeTag = styled.div<{ isFatal: boolean }>`
    background-color: ${props => props.isFatal
        ? '#cf6679'
        : '#03dac6'};
    color: #121212;
    padding: 4px 8px;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 4px;
    letter-spacing: 0.5px;
    margin-left: auto; /* Push to right side */
`;

interface ShootingPreviewProps {
    shooting: Shooting;
}

const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function ShootingPreview({ shooting }: ShootingPreviewProps) {
    const isFatal = shooting.attributes.Shooting_Type_V2 === "Fatal";
    const attrs = shooting.attributes;

    return (
        <PreviewCard isFatal={isFatal}>
            <IncidentTitle>Incident #{attrs.Incident_Num}</IncidentTitle>
            <InfoSection>
                <InfoItem><strong>Date:</strong> {formatDate(attrs.Shooting_Date)}</InfoItem>
                <InfoItem><strong>Time:</strong> {attrs.HOUR_OF_DAY}:00</InfoItem>
                <InfoItem><strong>District:</strong> {attrs.District}</InfoItem>
                <InfoItem><strong>Neighborhood:</strong> {attrs.NEIGHBORHOOD}</InfoItem>
                <InfoItem><strong>Victim:</strong> {attrs.Victim_Gender}, {attrs.Victim_Race}</InfoItem>
            </InfoSection>
            <CardFooter>
                {attrs.Multi_Victim === 1 ? (
                    <MultiVictimTag>Multiple Victims</MultiVictimTag>
                ) : (
                    <div></div>
                )}
                <TypeTag isFatal={isFatal}>
                    {attrs.Shooting_Type_V2}
                </TypeTag>
            </CardFooter>
        </PreviewCard>
    );
}