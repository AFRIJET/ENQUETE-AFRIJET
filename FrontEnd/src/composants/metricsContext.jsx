import axios from 'axios';
import React, { createContext, useContext, useEffect } from 'react'

const metrics = createContext();

const apiUrl = import.meta.env.VITE_API_URL;

export const useMetrics = () => useContext(metrics);

export const MetricsProvider = ({ children }) => {
    const getPageLoadTime = () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        return loadTime
    }

    const measureRequestTime = async () => {
        const urls = [
            'https://secure.enquete-afrijet-flygabon.com/api/enquete_agence',
            'https://secure.enquete-afrijet-flygabon.com/api/enquete_satisfaction',
            'https://secure.enquete-afrijet-flygabon.com/api/enquete_entreprise',
            'https://secure.enquete-afrijet-flygabon.com/admin/login',
            'https://secure.enquete-afrijet-flygabon.com/admin/admin',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_agence',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_agence_global',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_satisfaction',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_satisfaction_global',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_entreprise',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_entreprise_global',
            'https://secure.enquete-afrijet-flygabon.com/admin/users',
        ];

        const results = [];
        for (const url of urls) {
            const startTime = performance.now();
            try {
                await axios(url);
            } catch (error) { }
            const endTime = performance.now();
            const time = endTime - startTime;
            results.push({ url, time: time });
        }
        return results;
    }

    const measureConcurrentRequests = async () => {
        const urls = [
            'https://secure.enquete-afrijet-flygabon.com/api/enquete_agence',
            'https://secure.enquete-afrijet-flygabon.com/api/enquete_satisfaction',
            'https://secure.enquete-afrijet-flygabon.com/api/enquete_entreprise',
            'https://secure.enquete-afrijet-flygabon.com/admin/login',
            'https://secure.enquete-afrijet-flygabon.com/admin/admin',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_agence',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_agence_global',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_satisfaction',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_satisfaction_global',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_entreprise',
            'https://secure.enquete-afrijet-flygabon.com/admin/enquete_entreprise_global',
            'https://secure.enquete-afrijet-flygabon.com/admin/users',
        ];
        const startTime = performance.now();
        try {
            await Promise.all(urls.map(url => axios.get(url)));
        } catch (error) { }
        const endTime = performance.now();
        const results = endTime - startTime;
        return results;
    }

    const trackErrors = () => {
        let errorCount = 0;
        window.onerror = () => {
            errorCount++;
            return true;
        }
        return errorCount;
    }

    const collectAndSendMetrics = async () => {
        const metrics = {
            pageLoadTime: getPageLoadTime(),
            requestTime: await measureRequestTime(),
            concurrentRequest: await measureConcurrentRequests(),
            countErrors: trackErrors(),
        }

        await sendMetrics(metrics);
    }

    const sendMetrics = async (metrics) => {
        try {
            axios.post(`${apiUrl}/metrics`, metrics, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true, 
            })
        } catch (error) { }

    }

    useEffect(() => {
        collectAndSendMetrics();
    }, []);

    const value = {
        getPageLoadTime,
        measureRequestTime,
        measureConcurrentRequests,
        trackErrors,
    }

    return (
        <metrics.Provider value={value}>
            {children}
        </metrics.Provider>
    )
}

export default metrics