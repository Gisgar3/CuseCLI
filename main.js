// DEVELOPED BY GAVIN R. ISGAR 2023

import { intro, select, text, spinner } from '@clack/prompts';
import axios from "axios";

intro("Welcome to CuseCLI! Follow the prompts below to begin searching Syracuse data!");

/*
This getDatasets() function is used to gather all the current datasets provided by Syracuse as open data.
The URL used in the HTTP request was gathered using BurpSuite.
*/
let categories = [];
const processSpinner = spinner();
processSpinner.start("Pulling datasets...");
const getDatasets = async (url, paginationReq) => {
    let method = "GET";
    let queryParams = {
        agg: {
            fields: "downloadable,hasApi,source,tags,type,access"
        },
        fields: {
            datasets: "id,name,created,modified,modifiedProvenance,searchDescription,recordCount,source,extent,owner,thumbnailUrl,type,url,xFrameOptions,contentSecurityPolicy,siteUrl,tags,collection,size,initiativeCategories,slug,startDate,venue,initiativeId,initiativeTitle,organizers,isAllDay,onlineLocation,timeZone"
        },
        catalog: {
            groupIds: "any(af5799e7f6d84c5a944b053a47e18121)"
        },
        filter: {
            collection: "any(Dataset)"
        }
    };

    switch (paginationReq) {
        case 1: {
            queryParams = null;
            method = "GET";
        }
    }
    await axios({
        method: method,
        url: url,
        params: queryParams
    })
    .then((response) => {
        for (let num in response.data.data) {
            categories.push({value: `${num}`, label: `${response.data.data[num].attributes.name} [${response.data.data[num].attributes.recordCount} Total Records]`});
        }
        if (response.data.meta.next != undefined) {
            return getDatasets(response.data.meta.next, 1);
        }
        else {
            processSpinner.stop(`Found ${categories.length} datasets`);
            const categorySelect = select({
                message: "Select a Syracuse dataset",
                options: categories
            });
        }
    })
    .catch((error) => {
        console.error(error);
    });
};

const confirmDataset = () => {

}

getDatasets("https://opendata.arcgis.com/api/v3/search");
//confirmDataset();
/*switch (url) {
    case null: {
        url = "https://opendata.arcgis.com/api/v3/search";
    }
    case undefined: {
        url = "https://opendata.arcgis.com/api/v3/search"
    }
}*/