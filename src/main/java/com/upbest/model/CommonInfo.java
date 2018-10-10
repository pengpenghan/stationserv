package com.upbest.model;

public class CommonInfo {
    private Integer id;

    private Integer stationId;

    private Float totalPower;

    private Float totalPowerGeneration;

    private Float cityElecInputPower;

    private Float storagePowerGeneration;

    private Float esmEnergyStorage;

    private Float esmDumpEnergy;

    private Integer esmCycleTimes;

    private Float esmActivePower;

    private Float esmVoltage;

    private Float esmCurrent;

    private Integer esmWorkStatus;

    private Integer esmChargeStatus;

    private Float cdTotalChargePower;

    private Float cdTotalCharge;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getStationId() {
        return stationId;
    }

    public void setStationId(Integer stationId) {
        this.stationId = stationId;
    }

    public Float getTotalPower() {
        return totalPower;
    }

    public void setTotalPower(Float totalPower) {
        this.totalPower = totalPower;
    }

    public Float getTotalPowerGeneration() {
        return totalPowerGeneration;
    }

    public void setTotalPowerGeneration(Float totalPowerGeneration) {
        this.totalPowerGeneration = totalPowerGeneration;
    }

    public Float getCityElecInputPower() {
        return cityElecInputPower;
    }

    public void setCityElecInputPower(Float cityElecInputPower) {
        this.cityElecInputPower = cityElecInputPower;
    }

    public Float getStoragePowerGeneration() {
        return storagePowerGeneration;
    }

    public void setStoragePowerGeneration(Float storagePowerGeneration) {
        this.storagePowerGeneration = storagePowerGeneration;
    }

    public Float getEsmEnergyStorage() {
        return esmEnergyStorage;
    }

    public void setEsmEnergyStorage(Float esmEnergyStorage) {
        this.esmEnergyStorage = esmEnergyStorage;
    }

    public Float getEsmDumpEnergy() {
        return esmDumpEnergy;
    }

    public void setEsmDumpEnergy(Float esmDumpEnergy) {
        this.esmDumpEnergy = esmDumpEnergy;
    }

    public Integer getEsmCycleTimes() {
        return esmCycleTimes;
    }

    public void setEsmCycleTimes(Integer esmCycleTimes) {
        this.esmCycleTimes = esmCycleTimes;
    }

    public Float getEsmActivePower() {
        return esmActivePower;
    }

    public void setEsmActivePower(Float esmActivePower) {
        this.esmActivePower = esmActivePower;
    }

    public Float getEsmVoltage() {
        return esmVoltage;
    }

    public void setEsmVoltage(Float esmVoltage) {
        this.esmVoltage = esmVoltage;
    }

    public Float getEsmCurrent() {
        return esmCurrent;
    }

    public void setEsmCurrent(Float esmCurrent) {
        this.esmCurrent = esmCurrent;
    }

    public Integer getEsmWorkStatus() {
        return esmWorkStatus;
    }

    public void setEsmWorkStatus(Integer esmWorkStatus) {
        this.esmWorkStatus = esmWorkStatus;
    }

    public Integer getEsmChargeStatus() {
        return esmChargeStatus;
    }

    public void setEsmChargeStatus(Integer esmChargeStatus) {
        this.esmChargeStatus = esmChargeStatus;
    }

    public Float getCdTotalChargePower() {
        return cdTotalChargePower;
    }

    public void setCdTotalChargePower(Float cdTotalChargePower) {
        this.cdTotalChargePower = cdTotalChargePower;
    }

    public Float getCdTotalCharge() {
        return cdTotalCharge;
    }

    public void setCdTotalCharge(Float cdTotalCharge) {
        this.cdTotalCharge = cdTotalCharge;
    }
}