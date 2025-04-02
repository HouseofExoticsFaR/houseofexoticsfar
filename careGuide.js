class AquaticCareGuide {
    constructor() {
        this.endpoint = '/api/care-guide';
    }

    async getCareInfo(animalName) {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ animalName })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch care information');
            }

            const data = await response.json();
            return data.careInfo;
        } catch (error) {
            console.error('Error fetching care information:', error);
            return 'Unable to fetch care information at this time.';
        }
    }
}

