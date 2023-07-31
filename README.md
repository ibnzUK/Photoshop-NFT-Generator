Place your .psd file in the 'PHOTOSHOP NFT GENERATOR' folder. Make sure each attribute is in a separate group of layers. For example, you could have groups named "Background", "Watermark", and "Character". Within each group (attribute), each layer represents a different trait value. For instance, the "Background" group could have layers named "Green#10", "Blue#50", and "Premium#1". This setup would mean that your NFT could have a trait_type : "Background" , value: "Green", etc.

The number #10 next to your layer name means there is a 10% chance that this trait value will be used. Making it #100 does not guarantee that this value is used, It is good idea to first try out your collection generation and adjust rarity values accordinally. 
#0 would mean this trait is not used

1. Generate NFT Images from photoshop
In your Photoshop - go to File -> Scripts -> Browse -> navigate to PHOTOSHOP NFT GENERATOR -> and select CreateNFTs.js


2. To update Metadata fields 
In your Photoshop - go to File -> Scripts -> Browse -> navigate to PHOTOSHOP NFT GENERATOR -> and select UpdateMetadata.js 



Your NFT collection will be created in /collection 

Your metadata structure will look simmilar to this:
{
    "name": "BoredFlowers #1",
    "description": "My Generated Collection",
    "image": "https://myURL.com/1.png",
    "edition": 1,
    "attributes": [
        {
            "trait_type": "Character",
            "value": "Flower"
        },
        {
            "trait_type": "Watermark",
            "value": "Heart"
        },
        {
            "trait_type": "Background",
            "value": "Green"
        }
    ]
}