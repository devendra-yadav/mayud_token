
const {loadFixture} = require('@nomicfoundation/hardhat-network-helpers');
const {ethers} = require('hardhat');
const {expect} = require('chai');

describe('MayudToken', () => {
    async function contractDeployment(){
        const [deployer] = await ethers.getSigners();
        let MayudToken = await ethers.getContractFactory('MayudToken');
        let mayudToken = await MayudToken.deploy();
        await mayudToken.deployed();
        return{deployer, mayudToken};
    }    

    describe("Token Deployment", ()=>{
        it("should deploy a token", async ()=>{
            const {deployer, mayudToken} = await loadFixture(contractDeployment);
            console.log(`MayudToken deployed at: ${mayudToken.address}`);
            expect(mayudToken.address).to.be.properAddress;
        })
    })
})